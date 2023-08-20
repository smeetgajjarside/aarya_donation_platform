$('.special.cards .image').dimmer({
    on: 'hover'
  });

// document.querySelector('#yoga_btn').onclick = function () {
//     location.href = "/checkout/sri_sri_yoga";
// };

// document.querySelector('#happiness_btn').onclick = function () {
//     location.href = "/checkout/happiness_program";
// };

// document.querySelector('#art_of_silence_btn').onclick = function () {
//     location.href = "/checkout/art_of_silence";
// };

const link = window.location.href;
if (link.includes('success')){
    document.querySelector('#success_message').style.display = 'block';
    $('.message .close')
        .on('click', function() {
            $(this)
            .closest('.message')
            .transition('fade')
            ;
    });
}
