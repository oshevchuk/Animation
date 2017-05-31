/**
 * Created by Oshevchuk on 30.05.2017.
 */

$('.p4').click(function (e) {
    // alert(1);
    $('.p1').find('img').addClass('animup');
    $('.p2').find('img').addClass('animup');
    $('.p3').find('img').addClass('animup');
    $('.p4').find('img').addClass('animup');

    setTimeout(function () {
        $('.p1').find('img').removeClass('animup');
        $('.p2').find('img').removeClass('animup');
        $('.p3').find('img').removeClass('animup');
        $('.p4').find('img').removeClass('animup');
    },1000)
});
$('.p2').click(function (e) {
    // alert(1);
    $('.p1').find('img').addClass('anim_rot');
    $('.p2').find('img').addClass('anim_rot');
    $('.p3').find('img').addClass('anim_rot');
    $('.p4').find('img').addClass('anim_rot');

    setTimeout(function () {
        $('.p1').find('img').removeClass('anim_rot');
        $('.p2').find('img').removeClass('anim_rot');
        $('.p3').find('img').removeClass('anim_rot');
        $('.p4').find('img').removeClass('anim_rot');
    },1000);

    // $('.item').addClass('anim_rot');
    // $('.item').addClass('anim_rot');
    // $('.item').addClass('anim_rot');
    // $('.item').addClass('anim_rot');
    //
    // setTimeout(function () {
    //     $('.item').removeClass('anim_rot');
    //     $('.item').removeClass('anim_rot');
    //     $('.item').removeClass('anim_rot');
    //     $('.item').removeClass('anim_rot');
    // },1000)
});