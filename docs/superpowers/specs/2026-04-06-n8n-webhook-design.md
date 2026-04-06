# n8n Outbound Webhook Integration Design

## Goal

LimeL8 fires structured events to a configurable webhook URL (n8n or any HTTP endpoint) whenever significant actions occur in the app. n8n workflows consume these events and handle downstream automation (notifications, CRM sync, etc.). The LimeL8 side is decoupled from where n8n runs.

## Architecture

A single helper `lib/webhooks/fireEvent.ts` handles all outbound dispatch. API routes and Stripe webhook handlers call `fireEvent(event, data)` after successful DB writes — non-blocking, so n8n latency or downtime never affects the user-facing response.

The webhook URL is configured via the `N8N_WEBHOOK_URL` environment variable. If unset, all `fireEvent` calls are silent no-ops.

## Event Envelope

Every event sent to n8n has this shape:

```json
{
  "event": "booking.confirmed",
  "timestamp": "2026-04-06T10:30:00.000Z",
  "data": { ...event-specific payload... }
}
```

- `event` — dot-separated domain.action string
- `timestamp` — ISO 8601 UTC
- `data` — relevant IDs and key fields; no sensitive data (no passwords, no raw card info)

## Helper: `lib/webhooks/fireEvent.ts`

**Behaviour:**
- If `N8N_WEBHOOK_URL` is not set → no-op, returns immediately
- POSTs the JSON envelope to `N8N_WEBHOOK_URL`
- Non-blocking — callers do not `await` it
- Retries up to 3 times on non-2xx response or network error
- Backoff: 1s → 2s → 4s between retries
- On final failure → logs to console, does not throw, does not affect the caller

**Signature:**
```typescript
export function fireEvent(event: string, data: Record<string, unknown>): void
```

## Events

### Bookings
| Event | Trigger | Key payload fields |
|---|---|---|
| `booking.created` | Visitor submits booking request | bookingId, serviceId, orgId, customerId, requestedDate, message |
| `booking.confirmed` | Owner confirms (free) or Stripe checkout completes | bookingId, serviceId, orgId, customerId, requestedDate, stripeCheckoutSessionId? |
| `booking.declined` | Owner declines | bookingId, serviceId, orgId, customerId |
| `booking.cancelled` | Owner or customer cancels | bookingId, serviceId, orgId, customerId, cancelledBy ("owner" or "customer") |

### Orders
| Event | Trigger | Key payload fields |
|---|---|---|
| `order.created` | Buyer places order | orderId, listingId, buyerId, sellerId, amount |
| `order.paid` | Stripe payment_intent.succeeded | orderId, stripePaymentIntentId, amount |
| `order.shipped` | Seller marks shipped | orderId, buyerId, sellerId |
| `order.completed` | Buyer or cron marks complete | orderId, buyerId, sellerId |

### Subscriptions
| Event | Trigger | Key payload fields |
|---|---|---|
| `subscription.created` | New subscription started | subscriptionId, profileId, stripeSubscriptionId, planId |
| `subscription.cancelled` | Subscription cancelled | subscriptionId, profileId, stripeSubscriptionId |
| `subscription.billing_failed` | Stripe payment failed | subscriptionId, profileId, stripeSubscriptionId |

### Users / Profiles
| Event | Trigger | Key payload fields |
|---|---|---|
| `user.registered` | New account created | userId, email, name |
| `profile.updated` | Profile details changed | profileId, userId, updatedFields |

### Posts & Listings
| Event | Trigger | Key payload fields |
|---|---|---|
| `post.created` | New post published | postId, authorId, mediaCount |
| `listing.created` | New marketplace listing published | listingId, sellerId, title, price |

### Messages
| Event | Trigger | Key payload fields |
|---|---|---|
| `message.sent` | New in-app message sent | messageId, senderId, recipientId |

## Integration Points

### API routes
| Route | Event fired |
|---|---|
| `app/api/auth/register/route.ts` POST | `user.registered` |
| `app/api/posts/route.ts` POST | `post.created` |
| `app/api/listings/route.ts` POST | `listing.created` |
| `app/api/bookings/route.ts` POST | `booking.created` |
| `app/api/bookings/[id]/route.ts` PATCH (confirmed) | `booking.confirmed` |
| `app/api/bookings/[id]/route.ts` PATCH (declined) | `booking.declined` |
| `app/api/bookings/[id]/route.ts` PATCH (cancelled) | `booking.cancelled` |
| `app/api/orders/route.ts` POST | `order.created` |
| `app/api/orders/[id]/ship/route.ts` POST | `order.shipped` |
| `app/api/orders/[id]/complete/route.ts` POST | `order.completed` |
| `app/api/profiles/[id]/route.ts` PATCH | `profile.updated` |
| `app/api/messages/route.ts` POST | `message.sent` |

### Stripe webhook routes
| Route | Stripe event | LimeL8 event fired |
|---|---|---|
| `app/api/orders/webhook/route.ts` | `payment_intent.succeeded` | `order.paid` |
| `app/api/bookings/webhook/route.ts` | `checkout.session.completed` | `booking.confirmed` |
| `app/api/subscriptions/webhook/route.ts` | `customer.subscription.created` | `subscription.created` |
| `app/api/subscriptions/webhook/route.ts` | `customer.subscription.deleted` | `subscription.cancelled` |
| `app/api/subscriptions/webhook/route.ts` | `invoice.payment_failed` | `subscription.billing_failed` |

## Environment Variables

```
N8N_WEBHOOK_URL=   # URL of the n8n webhook trigger (empty = disabled)
```

Add to `.env.local.example` and Vercel environment variables.

## File Map

### New files
- `lib/webhooks/fireEvent.ts` — the dispatch helper

### Modified files
- All 12 API routes listed above — add `fireEvent(...)` call after successful DB write
- All 3 Stripe webhook routes — add `fireEvent(...)` call after status update
- `.env.local.example` — add `N8N_WEBHOOK_URL=`
