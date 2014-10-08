var UIObject = require('../../base/ui_object')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')
var formatTime = require('../../base/utils').formatTime
var $ = require('jquery')
var _ = require('underscore')

class SeekTime extends UIObject {
  get name() { return 'seek_time' }
  get template() {
    return JST.seek_time;
  }
  get attributes() {
    return {
      'class': 'seek-time hidden',
      'data-seek-time': ''
    };
  }
  constructor(mediaControl) {
    super()
    this.mediaControl = mediaControl
    this.addEventListeners()
    this.render()
  }

  addEventListeners() {
    this.listenTo(this.mediaControl, 'mediacontrol:mousemove:seekbar', this.showTime)
    this.listenTo(this.mediaControl, 'mediacontrol:mouseleave:seekbar', this.hideTime)
  }

  showTime(event) {
    var element = this.getHoverElement(event)
    if (element) {
      var offset = element.offset().left
      var width = element.width()
      var pos = (event.pageX - offset) / width * 100
      pos = Math.min(100, Math.max(pos, 0))
      this.currentTime = pos * this.mediaControl.container.getDuration() / 100
      this.time = formatTime(this.currentTime)
      this.$el.css('left', event.pageX - Math.floor((this.$el.width() / 2) + 6))
      this.$el.removeClass('hidden')
      var options = _.extend({}, event, {timestamp: this.currentTime, formattedTime: this.time})
      this.render(options);
    }
  }

  hideTime() {
    this.$el.addClass('hidden');
  }

  getHoverElement(event) {
    var elementClass = $(event.target).attr('class')
    var element = undefined
    if (elementClass === 'bar-container') {
      return $(event.target)
    } else if (elementClass === 'bar-hover'){
      return $(event.target).parent().parent()
    }
  }

  getExternalInterface() {}

  render(event) {
    if (this.mediaControl.container.getPlaybackType() === 'vod') {
      var style = Styler.getStyleFor(this.name);
      this.$el.html(this.template({time: this.time}));
      this.$el.append(style);
      this.mediaControl.$el.append(this.el);
    }
  }
}

module.exports = SeekTime;