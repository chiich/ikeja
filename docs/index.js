$(function() {
  $('#azpi').css({backgroundColor: "#FFFFFF"});
});   

var body = document.getElementsByTagName('body')[0];
var checkoutButton = document.getElementById('hosea');
var gaFunnel = document.getElementById('ga-funnel');
var infoPanel = document.getElementById('info');
var successPanel = document.getElementById('success');
var legacyPanel = document.getElementById('legacy');
// Feature detection
if (window.PaymentRequest) {
  // Payment Request is supported in this browser, so we can proceed to use it
  var request = new PaymentRequest(buildSupportedPaymentMethodData(),
    buildShoppingCartDetails());
  request.canMakePayment().then(function(canMakeAFastPayment) {
    if (canMakeAFastPayment) {
      gaFunnel.value = '1';
      body.classList.add('cann');
    } else {
      gaFunnel.value = '0';
      body.classList.add('kant');
    }
  }).catch(function(error) {
    // The user may have turned off the querying functionality in their privacy settings. 
    // We do not know whether they can make a fast payment, so pick a generic title.
    gaFunnel.value = '0';
  });
  checkoutButton.addEventListener('click', function() {

    request.show().then(function(paymentResponse) {
      // Here we would process the payment. For this demo, simulate immediate success:
      paymentResponse.complete('success')
        .then(function() {
          // For demo purposes:
          infoPanel.style.display = 'none';
          successPanel.style.display = 'block';
        });
    }).catch(function(error) {
      // Handle cancelled or failed payment. For demo purposes:
      infoPanel.style.display = 'none';
      legacyPanel.style.display = 'block';
    });        
  });
} else {
  // Payment Request is unsupported
  checkoutButton.addEventListener('click', function() {
    // For demo purposes:
    infoPanel.style.display = 'none';
    legacyPanel.style.display = 'block';
  });
}
function buildSupportedPaymentMethodData() {
  // Example supported payment methods:
  return [{
    supportedMethods: 'basic-card',
    data: {
      supportedNetworks: ['visa', 'mastercard'],
      supportedTypes: ['debit', 'credit']
    }
  }];
}
function buildShoppingCartDetails() {
  // Hardcoded for demo purposes:
  return {
    id: 'order-123',
    displayItems: [
      {
        label: 'Example item',
        amount: {currency: 'USD', value: '1.00'}
      }
    ],
    total: {
      label: 'Total',
      amount: {currency: 'USD', value: '1.00'}
    }
  };
}  

