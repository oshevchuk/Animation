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
    if(!freez) {
        var mousePos = getMousePos(canvas, e);
        // writeMessage(canvas, 'pos: '+mousePos.x+":"+mousePos.y);
        // console.log(mousePos);
        var x = mousePos.x;// e.layerX;
        var y = mousePos.y;// e.layerY;
        var pixel = context_mask.getImageData(x, y, 1, 1);
        el_img.forEach(function (item, index) {
            item.glow = false;
            if (item.color == pixel.data[0] && item.animation) {
                item.glow = true;
            }
        });
        tick();
    }
}, false);

$('.link-action').on('mousemove', function (e) {
    if(!freez) {

        var self = this;
        el_img.forEach(function (item, index) {
            item.glow = false;
            if (item.img == $(self).data('action')) {
                item.glow = true;
                // if (item.animation) {
                //     anim = true;
                //     if (item.img == 'p6' || item.img == 'p7')
                //         animate_bone(item);
                //     else
                //         render_tick(10, item.time, item.depends, item.animation, '', '');
                // }
                // console.log(item);

                // return true;

            }
        });
        // tick();
        if (!anim)
            tick();
    }
});

var anim = false;
$('.link-action').on('click', function (e) {
    var self=this;
    el_img.forEach(function (item, index) {
        item.glow = false;
        if (item.img == $(self).data('action')) {
            item.glow = true;
            if (item.animation) {
                anim = true;
                if (item.img == 'p6' || item.img == 'p7') {
                    item.glow = true;
                    animate_bone(item);
                }else
                    render_tick(10, item.time, item.depends, item.animation, '', '');
            }
            // console.log(item);

            // return true;

        }
    });
    // tick();
    if (!anim)
        tick();
});

//------------------------------------------------------------------------------
//In Action list prenn on the info icon 
//------------------------------------------------------------------------------

$('.info-action').on('click', function (e) {
    $('.modal').fadeIn(400);
    var selected_act=$(this).data('actioni');
    $('.variant').hide();
    $('#'+selected_act).show();
});

$('.close').on('click', function (e) {
    $('.modal').fadeOut(400);
});


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

var freez=false;
//------------------------------------------------------------------------------
//animate bone before Main animation + delay
//localFrames - frames to animate bone (one time to all bones)
//------------------------------------------------------------------------------
function animate_bone(element) {
    freez=true;
    var localFrames = 12;

    function anim() {
        localFrames--;
        var angle = (-localFrames + 20) * Math.PI / 180;
        context.clearRect(0, 0, canvas.width, canvas.height);

        el_img.forEach(function (item, index) {
            var adding_image = document.getElementById(item.img);
            if (item.glow) {
                // context.shadowColor = "green";
                adding_image=item.blu;
                // context.shadowBlur = 10;
            } else {
                // context.shadowBlur = 0;
            }

            if (item.img == element.img) {
                context.save();
                element.tx = 30;
                element.ty = 0;
                context.translate(element.x + 30, element.y);
                context.rotate(angle);
                context.translate(-element.x - 30, -element.y);

                // if (item.glow) {
                //     context.drawImage(item.blu, item.x, item.y);
                // }else {
                //     context.drawImage(adding_image, item.x, item.y);
                    context.drawImage(item.blu, item.x, item.y);
                // }

                context.restore()
            } else {
                // context.drawImage(adding_image, item.x, item.y);
                // if (item.glow) {
                //     context.drawImage(item.blu, item.x, item.y);
                // }else {
                    context.drawImage(adding_image, item.x, item.y);
                // }
            }
        });
        if (localFrames > 0)
            requestAnimationFrame(anim);
        else {
            // freez=false;
            render_tick(10, 60, element.depends, element.animation, element, angle);
        }
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
                // context.shadowColor = "yellow";
                // context.shadowBlur = 15;
                adding_image=item.blu;
            } else {
                // context.shadowBlur = 0;
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
                        // context.drawImage(item.blu, item.x, item.y);
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
                        // var adding_image = document.getElementById(item.img);
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
                    // var adding_image = document.getElementById(item.img);
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
                // var adding_image = document.getElementById(item.img);
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
            freez=false;
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
        time: time,
        blu:''
    };
    // el_img.push(info);
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
    var myDataCopy = tmp_context1.getImageData(0, 0, adding_image.width, adding_image.height);

    for (var i = 0; i < myData.data.length; i += 4) {
        if ((myData.data[i+3] != 0)) {
            myData.data[i] = color;
            myData.data[i + 1] = color;
            myData.data[i + 2] = color;

            myDataCopy.data[i] = 0;
            myDataCopy.data[i + 1] = 175;
            myDataCopy.data[i + 2] = 217;
        }
    }
    color += 20;

    var canvas_blu = document.createElement('canvas');
    var ctx_blu = canvas_blu.getContext('2d');
    canvas_blu.width = myDataCopy.width;
    canvas_blu.height = myDataCopy.height;
    ctx_blu.putImageData(myDataCopy, 0, 0);
    var image = new Image();
    image.src = canvas_blu.toDataURL();
    info.blu=image;
    // info.blu=myDataCopy;

    el_img.push(info);

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
    addImage('p6', 72, 185, '', 'translatey', '20', ['p1', 'p3', 'p2', 'p4', 'p6', 'p7'], 60);
    addImage('p7', 60, 175, '', 'rotate', '20', ['p1'], 40);
}

//------------------------------------------------------------------------------
//refrest the canvas - render one default frame (start position)
//------------------------------------------------------------------------------
function tick(e) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    el_img.forEach(function (item, index) {
        var adding_image = document.getElementById(item.img);
        if (item.glow) {
            // context.shadowColor = "green";

            // var myData = tmp_context1.getImageData(0, 0, adding_image.width, adding_image.height);
            //
            // for (var i = 0; i < myData.data.length; i += 4) {
            //     if (myData.data[i] != 0) {
            //         myData.data[i] = color;
            //         myData.data[i + 1] = color;
            //         myData.data[i + 2] = color;
            //     }
            // }

            // var image = new Image();
            // image.src=item.blu.data;
            //
            context.drawImage(item.blu, item.x, item.y);

            // context.save();
            // context.globalCompositeOperation = 'source-over';

            // context.putImageData(item.blu, item.x, item.y);
            // context.restore();
            // context.globalCompositeOperation='source-atop';
            // context.fillStyle="blue";
            // context.shadowBlur = 10;
            // ctx.fillRect(0,0,canvas.width,canvas.height);

            // context.globalCompositeOperation='source-over';

        } else {
            context.shadowBlur = 0;
            context.drawImage(adding_image, item.x, item.y);
        }
        // var adding_image = document.getElementById(item.img);
        // context.drawImage(adding_image, item.x, item.y);
    });
    anim=false;
};

