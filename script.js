/**
 * Created by Oshevchuk on 30.05.2017.
 */


//------------------------------------------------------------------------------
//global wariables
//------------------------------------------------------------------------------
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var canvas_mask = document.getElementById('mask');
var context_mask = canvas_mask.getContext('2d');


//------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function (e) {
    init_Scene();
}, false);

//------------------------------------------------------------------------------
//when mouse move on canvas set glow effect on hover element
//------------------------------------------------------------------------------
canvas.addEventListener('mousemove', function (e) {
    var mousePos = getMousePos(canvas, e);
    // writeMessage(canvas, 'pos: '+mousePos.x+":"+mousePos.y);
    // console.log(mousePos);
    var x = mousePos.x;// e.layerX;
    var y = mousePos.y;// e.layerY;
    var pixel = context_mask.getImageData(x, y, 1, 1);
    el_img.forEach(function (item, index) {
        item.glow = false;
        if (item.color == pixel.data[0]) {
            item.glow = true;
        }
    });
    tick();
}, false);


//------------------------------------------------------------------------------
//get selected element from mask and do animation
//------------------------------------------------------------------------------
document.getElementById('myCanvas').addEventListener('click', function (e) {
    var mousePos = getMousePos(canvas, e);
    var anim = false;
    var x = mousePos.x;// event.layerX;
    var y = mousePos.y;// event.layerY;
    var pixel = context_mask.getImageData(x, y, 1, 1);

    el_img.forEach(function (item, index) {
        item.glow = false;
        if (item.color == pixel.data[0]) {
            item.glow = true;
            if (item.animation) {
                anim = true;
                if (item.img == 'p6' || item.img == 'p7')
                    animate_bone(item);
                else
                    render_tick(10, item.time, item.depends, item.animation, '', '');
            }
        }
    });
    if (!anim)
        tick();
});

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

//------------------------------------------------------------------------------
//animate bone before Main animation + delay
//localFrames - frames to animate bone (one time to all bones)
//------------------------------------------------------------------------------
function animate_bone(element) {
    var localFrames = 12;

    function anim() {
        localFrames--;
        var angle = (-localFrames + 20) * Math.PI / 180;
        context.clearRect(0, 0, canvas.width, canvas.height);

        el_img.forEach(function (item, index) {
            var adding_image = document.getElementById(item.img);
            if (item.glow) {
                context.shadowColor = "green";
                context.shadowBlur = 10;
            } else {
                context.shadowBlur = 0;
            }

            if (item.img == element.img) {
                context.save();
                element.tx = 30;
                element.ty = 0;
                context.translate(element.x + 30, element.y);
                context.rotate(angle);
                context.translate(-element.x - 30, -element.y);
                context.drawImage(adding_image, item.x, item.y);
                context.restore()
            } else {
                context.drawImage(adding_image, item.x, item.y);
            }
        });
        if (localFrames > 0)
            requestAnimationFrame(anim);
        else
            render_tick(10, 60, element.depends, element.animation, element, angle);
    }

    requestAnimationFrame(anim);
}


//------------------------------------------------------------------------------
//Render animation for each related element after bone animation
//------------------------------------------------------------------------------
function render_tick(animation_duration, frames, elements, type, select_element, select_el_angle) {
    var main_frames = frames;

    function step() {
        frames--;
        context.clearRect(0, 0, canvas.width, canvas.height);

        el_img.forEach(function (item, index) {
            var adding_image = document.getElementById(item.img);

            if (item.glow) {
                context.shadowColor = "yellow";
                context.shadowBlur = 15;
            } else {
                context.shadowBlur = 0;
            }

            if (elements.indexOf(item.img) >= 0) {
                if (type == 'translatey') {
                    context.save();
                    var angle = Math.sin((Math.PI * (frames * 3)) / 180) * (-1);
                    context.translate(0, angle * 15 + 5);
                    if (item.img == select_element.img) {
                        context.translate(select_element.x + select_element.tx, select_element.y);
                        context.rotate(select_el_angle);
                        context.translate(-select_element.x - select_element.tx, -select_element.y);
                        context.drawImage(adding_image, item.x, item.y);
                    } else {
                        context.drawImage(adding_image, item.x, item.y);
                    }
                    context.restore();
                } else if (type == "rotate") {
                    context.save();
                    if (item.img != 'p4' && item.img != select_element.img) {
                        var angle = 0;
                        if (main_frames / 2 - frames < 0) {
                            angle = (frames / 6) * Math.PI / 180 - 10 * Math.PI / 180;
                        } else {
                            angle = -1 * (frames / 6) * Math.PI / 180 + 0 * Math.PI / 180;
                        }
                        var adding_image = document.getElementById(item.img);
                        context.translate(item.x + 50, canvas.height / 2);
                        context.rotate(angle);
                        context.translate(-item.x - 50, -canvas.height / 2);
                        context.drawImage(adding_image, item.x, item.y);
                    }
                    context.restore();
                } else if (type = "translatex") {
                    context.save();
                    var angle = Math.sin((Math.PI * (frames * 3)) / 180) * (-1);
                    context.translate(angle * 15 + 5, 0);
                    var adding_image = document.getElementById(item.img);
                    if (item.img == select_element.img) {
                        context.translate(select_element.x + select_element.tx, select_element.y);
                        context.rotate(select_el_angle);
                        context.translate(-select_element.x - select_element.tx, -select_element.y);
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
                if (type == "rotate" && item.img == select_element.img) {
                    context.save();
                    if (item.img == select_element.img) {
                        context.translate(select_element.x + select_element.tx, select_element.y);
                        context.rotate(select_el_angle);
                        context.translate(-select_element.x - select_element.tx, -select_element.y);
                        context.drawImage(adding_image, item.x, item.y);
                    }
                    context.restore();
                } else
                    context.drawImage(adding_image, item.x, item.y);
            }
        });
        if (frames > 0) {
            requestAnimationFrame(step);
        } else {
            tick();
        }
    };
    requestAnimationFrame(step);
}


// function writeMessage(canvas, message) {
//     var context = canvas.getContext('2d');
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.font = "16pt Calibri";
//     context.fillStyle = 'black';
//     context.fillText(message, 10, 10);
// }

//------------------------------------------------------------------------------
//Add new image and create unique mask for this item
//set animation dependents for other images
//you can manual set mask for current image
//el_img = Object array for adding images and properties
//color - start color number rgb(color, clor, clor) - autoincrements +20
//------------------------------------------------------------------------------
var el_img = [];
color = 50;
function addImage(image, x, y, mask, animation, step, depends, time) {
    var info = {
        img: image,
        x: x,
        y: y,
        color: color,
        animation: animation,
        step: step,
        depends: depends,
        time: time
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
    var myData = tmp_context1.getImageData(0, 0, adding_image.width, adding_image.height);

    for (var i = 0; i < myData.data.length; i += 4) {
        if (myData.data[i] != 0) {
            myData.data[i] = color;
            myData.data[i + 1] = color;
            myData.data[i + 2] = color;
        }
    }
    color += 20;

    tmp_context1.putImageData(myData, 0, 0);
    if (!mask) {
        context_mask.drawImage(tmp_canvas, x, y);
    } else {
        context_mask.drawImage(add_mask, x, y);
    }
}

//------------------------------------------------------------------------------
//add images with properties to canvas
//------------------------------------------------------------------------------
function init_Scene() {
    addImage('p1', 60, 5);//спинка
    addImage('p5', 40, 180);
    addImage('p3', 50, 130);
    addImage('p2', 85, 185, '', 'rotate', '20', ['p1', 'p3', 'p2', 'p4', 'p6', 'p7'], 60);
    // addImage('p2', 50, 170, 'mask1');
    addImage('p4', 185, 166, '', 'translatex', '20', ['p3', 'p4'], 60);
    addImage('p6', 72, 187, '', 'translatey', '20', ['p1', 'p3', 'p2', 'p4', 'p6', 'p7'], 60);
    addImage('p7', 60, 175, '', 'rotate', '20', ['p1'], 40);
}

//------------------------------------------------------------------------------
//refrest the canvas - render one default frame (start position)
//------------------------------------------------------------------------------
function tick(e) {
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

