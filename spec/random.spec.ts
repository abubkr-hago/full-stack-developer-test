describe('Random', function () {
  it('should test checkout', async function () {
    const session = await new Parse.Query(Parse.Session)
      .include('user')
      .first({ useMasterKey: true });
    const sessionToken = session.getSessionToken();
    const res = await Parse.Cloud.run('checkoutCart', {}, { sessionToken });
    console.log('');
  });
});

/**
 * {
 *   "id": "pi_3PUfzd06N7vpTor21rWMNHOz",
 *   "object": "payment_intent",
 *   "amount": 10000,
 *   "amount_capturable": 0,
 *   "amount_details": {
 *     "tip": {}
 *   },
 *   "amount_received": 0,
 *   "application": null,
 *   "application_fee_amount": null,
 *   "automatic_payment_methods": {
 *     "allow_redirects": "always",
 *     "enabled": true
 *   },
 *   "canceled_at": null,
 *   "cancellation_reason": null,
 *   "capture_method": "automatic_async",
 *   "client_secret": "pi_3PUfzd06N7vpTor21rWMNHOz_secret_YF7ewiQVLQctxuNFlaURQjSUf",
 *   "confirmation_method": "automatic",
 *   "created": 1719109045,
 *   "currency": "aed",
 *   "customer": null,
 *   "description": null,
 *   "invoice": null,
 *   "last_payment_error": null,
 *   "latest_charge": null,
 *   "livemode": false,
 *   "metadata": {},
 *   "next_action": null,
 *   "on_behalf_of": null,
 *   "payment_method": null,
 *   "payment_method_configuration_details": null,
 *   "payment_method_options": {
 *     "card": {
 *       "installments": null,
 *       "mandate_options": null,
 *       "network": null,
 *       "request_three_d_secure": "automatic"
 *     }
 *   },
 *   "payment_method_types": [
 *     "card"
 *   ],
 *   "processing": null,
 *   "receipt_email": null,
 *   "review": null,
 *   "setup_future_usage": null,
 *   "shipping": null,
 *   "source": null,
 *   "statement_descriptor": null,
 *   "statement_descriptor_suffix": null,
 *   "status": "requires_payment_method",
 *   "transfer_data": null,
 *   "transfer_group": null
 * }
 */
