(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

//   const handlePayment = async () => {
//     const response = await fetch('/create-order', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             amount: 500, // Pass the amount you want to charge
//             currency: 'INR'
//         })
//     });

//     const order = await response.json();

//     const options = {
//         "key": "YOUR_RAZORPAY_KEY_ID", // Replace with your key ID
//         "amount": order.amount,
//         "currency": order.currency,
//         "name": "Your Project Name",
//         "description": "Test Transaction",
//         "order_id": order.id, // This is the Order ID created by Razorpay
//         "handler": function (response){
//             console.log(response);
//             // Handle success
//         },
//         "prefill": {
//             "name": "User Name",
//             "email": "user@example.com",
//             "contact": "9999999999"
//         },
//         "theme": {
//             "color": "#3399cc"
//         }
//     };

//     const rzp = new Razorpay(options);
//     rzp.open();
// };

// document.getElementById('payment-button').onclick = handlePayment;
