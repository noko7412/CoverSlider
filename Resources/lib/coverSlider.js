var createCoverSlider;
require('ti.viewshadow');
var Draggable = require('ti.draggable');


createCoverSlider = function(args) {
  var bounce, changeCover, cover, current_cover, coverSlider, current, duration, half, ledge, left, onCurrentChanged, right, shadow, slideCover, threshold, _ref, _ref2;
  _ref = [args.left, args.cover, args.right], left = _ref[0], cover = _ref[1], right = _ref[2];
  ledge = cover.width * 0.85;
  threshold = cover.width * 0.15;
  half = {
    width: cover.width / 2,
    height: cover.height / 2
  };
  duration = {
    slide: 200,
    swipe: 150,
    bounce: 100,
    change_out: 120,
    change_in: 300
  };
  bounce = 8;
  shadow = {
    shadowRadius: 2,
    shadowOpacity: 0.6,
    shadowOffset: {
      x: 4,
      y: 0
    },
    shadowColor: 'black'
  };
  _ref2 = [-1, 0, -2], left.zIndex = _ref2[0], cover.zIndex = _ref2[1], right.zIndex = _ref2[2];
  current = 'cover';
  current_cover = cover;
  // New Draggable Cover
  cover = Draggable.createView({
    left:0,
    top:0,
    width:cover.width,
    height:cover.height,
    backgroundColor:'red',
    minLeft:threshold - cover.width ,
    maxLeft:cover.width -threshold,
    axis:'x'
  });
  cover.add(current_cover);

  // Shadows and background views
  onCurrentChanged = function() {
    if (current === 'left') {
      left.visible = true;
      right.visible = false;
      shadow.shadowOffset.x = -4;
    } else if (current === 'right') {
      right.visible = true;
      left.visible = false;
      shadow.shadowOffset.x = 4;
    }
    return cover.setShadow(shadow);
  };
  //Slide Cover animation
  cover.slideCover = function(position) {
    var delta_xs;
    delta_xs = {
      left: ledge,
      cover: 0,
      right: -ledge
    };
    //Ti.API.info(position + " : " + delta_xs[position]);
    cover.animate({
      left: delta_xs[position],
      duration: duration.slide
    });
    current = position;
    return onCurrentChanged();
  };
  var start_left;
  cover.addEventListener('start', function(e) {
    start_left = e.left;
  });
  cover.addEventListener('move', function(e) {
    //Ti.API.info("MOVE");
    if ( e.left < 0 && current !== 'right') {
      current = 'right';
      onCurrentChanged();
    } else if (e.left > 0 && current !== 'left') {
      current = 'left';
      onCurrentChanged();
    } else if (e.left === 0 && current !== 'cover') {
      current = 'cover';
      onCurrentChanged();
    }
  });
  cover.addEventListener('end',function(e) {
    var animate_bounce, animate_swipe, bounce_, delta_x;
    delta_x = e.left - start_left - half.width;
    //Ti.API.info("delta_x: " + delta_x);
    //Ti.API.info("start_left: " + start_left);
    //Ti.API.info("e.left: " + e.left);

    if (e.left < -half.width) {
       delta_x = -ledge;
       current = 'right';
       bounce_ = -bounce;
    } else if (e.left > half.width) {
       delta_x = ledge;
       current = 'left';
       bounce_ = bounce;
    } else {
       delta_x = 0;
       current = 'cover';
       bounce_ = e.left < 0 ? bounce : -bounce;
    }

    animate_swipe = {
      left: delta_x + bounce_,
      duration: duration.swipe
    };
    animate_bounce = {
      left: delta_x,
      duration: duration.bounce
    };
    cover.left = e.left;
    cover.animate(animate_swipe, function() {
      return cover.animate(animate_bounce);
    });
    return onCurrentChanged();
  });
  cover.changeCover = function(newCover) { 
    var animate_in, animate_out, delta_x;
    if (current === 'cover') {
      return;
    }
    if (current === 'left') {
      delta_x = half.width * 2;
    } else {
      delta_x = -half.width * 2;
    }
    animate_out = {
      left: delta_x,
      duration: duration.change_out
    };
    animate_in = {
      left: 0 ,
      duration: duration.change_in
    };
    return cover.animate(animate_out, function() {
      cover.remove(current_cover);
      cover.add(newCover);
      current_cover = newCover;
      current = 'cover';
      return cover.animate(animate_in);
    });
  };
  cover.current = function () {
    return current;
  };
  return cover;
};
exports.createCoverSlider = createCoverSlider;
