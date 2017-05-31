/**
 * Created by Oshevchuk on 30.05.2017.
 */

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var canvas_mask = document.getElementById('mask');
var context_mask = canvas_mask.getContext('2d');

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
                render_tick(10, 60, item.depends, item.animation);
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

var animation_frames;

function render_tick(animation_duration, frames, elements, type) {
    // /translatey
        
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

            if (item.glow) {
                context.shadowColor = "yellow";
                context.shadowBlur = 15;
            } else {
                context.shadowBlur = 0;
            }

            if (elements.indexOf(item.img) >= 0) {
                context.shadowColor = "red";
                context.shadowBlur = 15;

                if (type == 'translatey') {

                    context.save();
                    var angle = Math.sin((Math.PI * (frames * 3)) / 180) * (-1);
                    // console.log(angle);
                    context.translate(0, angle * 15+5);

                    var adding_image = document.getElementById(item.img);
                    context.drawImage(adding_image, item.x, item.y);

                    context.restore();
                } else if (type == "rotate") {
                    context.save();
                    var angle = Math.sin((Math.PI * (frames * 3)) / 180) * (-1);
                    // console.log(angle);
                    // context.translate(0, angle * 20);
                    var adding_image = document.getElementById(item.img);

                    context.translate(canvas.width / 2, canvas.height / 2);
                    context.rotate(-0.2 * Math.cos((-frames) * Math.PI / 180));
                    context.translate(-canvas.width / 2, -canvas.height / 2);

                    context.drawImage(adding_image, item.x, item.y);


                    context.restore();
                }

            } else {
                context.shadowBlur = 0;


                var adding_image = document.getElementById(item.img);
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
        }
    };

    if (frames > 0) {
        step();
        // requestAnimationFrame(step);
    }else
        tick();
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

function addImage(image, x=0, y=0, mask, animation, step, depends) {

    var info = {
        img: image,
        x: x,
        y: y,
        color: color,
        animation: animation,
        step: step,
        depends: depends
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
    addImage('p1', 60, 10);
    addImage('p5', 40, 180);
    addImage('p3', 50, 130);
    addImage('p2', 50, 170, '', 'rotate', '20', ['p1', 'p3', 'p2', 'p4']);
    // addImage('p2', 50, 170, 'mask1');
    addImage('p4', 182, 167, '', 'translatey', '20', ['p1', 'p3', 'p2', 'p4']);

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