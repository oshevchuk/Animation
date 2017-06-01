/**
 * Created by Oshevchuk on 30.05.2017.
 */

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var canvas_mask = document.getElementById('mask');
var context_mask = canvas_mask.getContext('2d');

var freez = false;

canvas.addEventListener('mousemove', function (e) {
    var mousePos = getMousePos(canvas, e);
    // writeMessage(canvas, 'pos: '+mousePos.x+":"+mousePos.y);
    // console.log(mousePos);
    var x = e.layerX;
    var y = e.layerY;
    var pixel = context_mask.getImageData(x, y, 1, 1);
    //
    // console.log(pixel.data, new Date());
    el_img.forEach(function (item, index) {
        item.glow = false;
        if (item.color == pixel.data[0]) {
            // console.log(item);
            item.glow = true;

            // if(item.animation){
            //     console.log("animated");
            //     anim=true;
            //     render_tick(10, 60, ['p1', 'p3', 'p2', 'p4'], item.animation);
            // render_tick(10, 60, item.depends, item.animation);
            // }
        }
    });
    tick();

}, false);

document.getElementById('myCanvas').addEventListener('click', function (e) {
    pic(e);
});

function pic(event) {

    var anim = false;

    var x = event.layerX;
    var y = event.layerY;
    var pixel = context_mask.getImageData(x, y, 1, 1);

    console.log(pixel.data);

    el_img.forEach(function (item, index) {
        item.glow = false;
        if (item.color == pixel.data[0]) {
            console.log(item);
            item.glow = true;

            if (item.animation) {
                console.log("animated");
                anim = true;
                // render_tick(10, 60, ['p1', 'p3', 'p2', 'p4'], item.animation);
                if (item.img == 'p6' || item.img == 'p7')
                    animate_bone(item);
                else
                    render_tick(10, item.time, item.depends, item.animation, '','');
            }
        }
    });

    // var img=new window.Image();
    // img.setAttribute("src", canvas_mask.toDataURL());
    // console.log(img);
    // document.body.appendChild(img);
    if (!anim)
        tick();
}


//-----------------------------------------------------------------
//animate bone before Root animation
//-----------------------------------------------------------------
function animate_bone(element) {
    console.log("----" + element);

    var localFrames = 12;

    function anim() {
        localFrames--;
        var angle = (-localFrames + 20) * Math.PI / 180;


        context.clearRect(0, 0, canvas.width, canvas.height);
        el_img.forEach(function (item, index) {

            if (item.glow) {
                context.shadowColor = "green";
                context.shadowBlur = 10;
            } else {
                context.shadowBlur = 0;
            }

            // if (item.img == 'p6' || item.img == 'p7') {
            if (item.img == element.img) {
                context.save();
                var adding_image = document.getElementById(item.img);
                element.tx = 30;
                element.ty = 0;

                context.translate(element.x + 30, element.y);
                context.rotate(angle);
                context.translate(-element.x - 30, -element.y);
                // context.translate(30, 0);
                context.drawImage(adding_image, item.x, item.y);
                // context.translate(30, 0);
                context.restore()
            }else{
                var adding_image = document.getElementById(item.img);
                context.drawImage(adding_image, item.x, item.y);
            }
        });
        if (localFrames > 0)
        // anim();
            requestAnimationFrame(anim);
        else
            render_tick(10, 60, element.depends, element.animation, element, angle);
    }

    if (localFrames > 0) {
        // anim();
        requestAnimationFrame(anim);
    } else {

        // tick();
    }
}

var animation_frames;


//-----------------------------------------------------------------
//Render animation for each related element
//-----------------------------------------------------------------

function render_tick(animation_duration, frames, elements, type, select_element, select_el_angle) {
    // /translatey
    console.log("render" + new Date());
    var main_frames=frames;
    // window.requestAnimationFrame()

    // setInterval(

    function step() {

        frames--;

        // if (frames < 0) {
        //     tick();
        //     clearInterval(this);
        //     return;
        // }

        // console.log(1);
        context.clearRect(0, 0, canvas.width, canvas.height);

        // console.log(elements);

        el_img.forEach(function (item, index) {

            var adding_image = document.getElementById(item.img);

            if (item.glow) {
                context.shadowColor = "yellow";
                context.shadowBlur = 15;
            } else {
                context.shadowBlur = 0;
            }



            if (elements.indexOf(item.img) >= 0) {
                // context.shadowColor = "red";
                // context.shadowBlur = 15;


                if (type == 'translatey') {


                    context.save();
                    var angle = Math.sin((Math.PI * (frames * 3)) / 180) * (-1);
                    // console.log(angle);
                    context.translate(0, angle * 15 + 5);

                    // var adding_image = document.getElementById(item.img);

                    if (item.img == select_element.img) {
                        context.translate(select_element.x + select_element.tx, select_element.y);
                        context.rotate(select_el_angle);
                        context.translate(-select_element.x - select_element.tx, -select_element.y);
                        // context.translate(30, 0);
                        context.drawImage(adding_image, item.x, item.y);
                        // context.drawImage(adding_image, item.x, item.y);
                    } else {
                        context.drawImage(adding_image, item.x, item.y);
                    }

                    context.restore();
                } else if (type == "rotate") {
                    context.save();

                    // context.drawImage(adding_image, item.x, item.y);

                    // context.drawImage(adding_image, item.x, item.y);
                    // console.log(select_element);
                    if (item.img == select_element.img) {
                        // context.translate(select_element.x + select_element.tx, select_element.y);
                        // context.rotate(select_el_angle);
                        // context.translate(-select_element.x - select_element.tx, -select_element.y);
                        // context.translate(30, 0);
                        // context.drawImage(adding_image, item.x, item.y);
                        // context.drawImage(adding_image, item.x, item.y);
                    } else {
                        // var angle = Math.sin((Math.PI * (frames * 3)) / 180) * (-1);
                        var angle=0;
                        if(main_frames/2-frames<0) {
                            angle = (frames / 4) * Math.PI / 180-20*Math.PI/180;
                        }else{
                            // angle = 1*(frames / 4) * Math.PI / 180+5*Math.PI/180;
                        }
                        // console.log(angle);
                        // context.translate(0, angle * 20);
                        var adding_image = document.getElementById(item.img);

                        context.translate(item.x+50, canvas.height / 2);
                        // context.rotate(-0.2 * Math.cos((-frames) * Math.PI / 180));
                        context.rotate(angle);
                        context.translate(-item.x-50, -canvas.height / 2);

                        context.drawImage(adding_image, item.x, item.y);
                    }

                    context.restore();
                } else if(type="translatex"){
                    context.save();
                    var angle = Math.sin((Math.PI * (frames * 3)) / 180) * (-1);
                    // console.log(angle);
                    context.translate(angle * 15 + 5, 0);

                    var adding_image = document.getElementById(item.img);

                    if (item.img == select_element.img) {
                        context.translate(select_element.x + select_element.tx, select_element.y);
                        context.rotate(select_el_angle);
                        context.translate(-select_element.x - select_element.tx, -select_element.y);
                        // context.translate(30, 0);
                        context.drawImage(adding_image, item.x, item.y);
                        context.drawImage(adding_image, item.x, item.y);
                    } else {
                        context.drawImage(adding_image, item.x, item.y);
                    }

                    context.restore();
                }

            } else {
                context.shadowBlur = 0;


                var adding_image = document.getElementById(item.img);

                if(type=="rotate" && item.img == select_element.img) {
                    context.save();
                    if (item.img == select_element.img) {
                        context.translate(select_element.x + select_element.tx, select_element.y);
                        context.rotate(select_el_angle);
                        context.translate(-select_element.x - select_element.tx, -select_element.y);
                        // context.translate(30, 0);
                        // context.drawImage(adding_image, item.x, item.y);
                        context.drawImage(adding_image, item.x, item.y);
                    }
                    context.restore();
                }else
                    context.drawImage(adding_image, item.x, item.y);
            }

            // console.log(item.img);


        });
        // }, animation_duration);

        // step
        // if (frames < 0) {
        //     tick();
        //     clearInterval(this);
        //     return;
        // }

        // step();
        // console.log(frames);

        if (frames > 0) {
            // step();
            requestAnimationFrame(step);
            // requestAnimationFrame(step);
        }else{
            tick();
        }
    };

    // if (frames > 0) {
    //     step();
        requestAnimationFrame(step);
    // } else
    //     tick();
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function writeMessage(canvas, message) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "16pt Calibri";
    context.fillStyle = 'black';
    context.fillText(message, 10, 10);
}


function render() {
    var p1 = document.getElementById("p1");

    context.drawImage(p1, 60, 10, 108, 133);

    // var mask=document.createElement('canvas');
    // mask.width=canvas.width;
    // mask.height=canvas.height;
    // var maskCtx=mask.getContext('2d');
    // maskCtx.fillStyle="grey";
    // maskCtx.drawImage(p1, 60,10, 108,133);
    // maskCtx.globalCompositeOperation='xor';
    //
    // context.drawImage(mask, 0,0);

    // var data=p1.getImageData(0,0, p1.width, p1.height );
    // console.log(data);

    var canvas1 = document.createElement('canvas');
    var context1 = canvas1.getContext('2d');
    // var img = document.getElementById('myimg');
    canvas1.width = p1.width;
    canvas1.height = p1.height;
    context1.drawImage(p1, 0, 0);
    var myData = context1.getImageData(0, 0, p1.width, p1.height);

    // console.log(myData.data.length);

    for (var i = 0; i < myData.data.length; i += 4) {
        // for(var i=0; i<41000; i+=4){
        if (myData.data[i] != 0) {
            myData.data[i] = 200;
            myData.data[i + 1] = 200;
            myData.data[i + 2] = 200;
            myData.data[i + 2] = 200;
        }
        // console.log(myData.data[i+1]);
    }
    context1.putImageData(myData, 0, 0);
    // context1.putImageData(myData, 0,100, 10,10,100,100);
    // context1.drawImage(myData.data, 0,0);
    // context1.drawImage(myData.data, 0,100);


    // console.log(myData);
    context_mask.drawImage(canvas1, 60, 10);

}

var elements_data = [];
var el_img = [];

color = 50;

function addImage(image, x=0, y=0, mask, animation, step, depends, time) {

    var info = {
        img: image,
        x: x,
        y: y,
        color: color,
        animation: animation,
        step: step,
        depends: depends,
        time:time
    };

    el_img.push(info);

    var adding_image = document.getElementById(image);
    var add_mask;
    if (mask) {
        add_mask = document.getElementById(mask);
    }

    context.drawImage(adding_image, x, y);

    var tmp_canvas = document.createElement('canvas');
    var tmp_context1 = tmp_canvas.getContext('2d');

    tmp_context1.width = adding_image.width;
    tmp_context1.height = adding_image.height;
    tmp_context1.drawImage(adding_image, 0, 0);//,  adding_image.width*scale, adding_image.height*scale );
    // tmp_context1.scale(scale, scale);
    var myData = tmp_context1.getImageData(0, 0, adding_image.width, adding_image.height);
    // myData.scale(scale, scale);

    // if(scale!=1)


    for (var i = 0; i < myData.data.length; i += 4) {
        // for(var i=0; i<41000; i+=4){
        if (myData.data[i] != 0) {
            myData.data[i] = color;
            myData.data[i + 1] = color;
            myData.data[i + 2] = color;
            // myData.data[i+3]=0;
        }
        // console.log(myData.data[i+1]);
    }
    // console.log(myData);
    color += 20;

    tmp_context1.putImageData(myData, 0, 0);

    // elements_data.push(myData);
    if (!mask) {
        context_mask.drawImage(tmp_canvas, x, y);
    } else {
        context_mask.drawImage(add_mask, x, y);
    }
}

function pre_render() {
    addImage('p1', 60, 5);//спинка
    addImage('p5', 40, 180);
    addImage('p3', 50, 130);
    addImage('p2', 85, 185, '', 'rotate', '20', ['p1', 'p3', 'p2', 'p4'], 60);
    // addImage('p2', 50, 170, 'mask1');
    addImage('p4', 185, 166, '', 'translatex', '20', ['p3', 'p4'], 60);


    addImage('p6', 72, 187, '', 'translatey', '20', ['p1', 'p3', 'p2', 'p4', 'p6', 'p7'], 60);

    addImage('p7', 60, 175, '', 'rotate', '20', ['p1'], 40);

}


function tick(e) {
    // console.log(1);
    context.clearRect(0, 0, canvas.width, canvas.height);

    el_img.forEach(function (item, index) {

        if (item.glow) {
            context.shadowColor = "green";
            context.shadowBlur = 10;
        } else {
            context.shadowBlur = 0;
        }

        var adding_image = document.getElementById(item.img);
        context.drawImage(adding_image, item.x, item.y);
    });
};


document.addEventListener("DOMContentLoaded", function (e) {
    // alert('load');
    // render();
    pre_render();
}, false);