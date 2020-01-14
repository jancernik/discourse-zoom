import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import { formattedSchedule } from "../lib/webinar-helpers";
import showModal from "discourse/lib/show-modal";
import { alias, or } from "@ember/object/computed";
import { ajax } from "discourse/lib/ajax";

export default Component.extend({
  loading: false,
  topic: null,
  webinar: null,
  webinarId: null,
  showTimer: false,
  NOT_STARTED: "not_started",
  canEdit: alias("topic.details.can_edit"),

  hostDisplayName: Ember.computed.or(
    "webinar.host.name",
    "webinar.host.username"
  ),
  AUTOMATIC_APPROVAL: "automatic",
  MANUAL_APPROVAL: "manual",
  NO_REGISTRATION: "no_registration",

  BEFORE_VALUE: "before",
  DURING_VALUE: "during",
  AFTER_VALUE: "after",
  hostDisplayName: or("webinar.host.name", "webinar.host.username"),

  init() {
    this._super(...arguments);
    this.fetchDetails();
  },

  fetchDetails() {
    if (!this.webinarId) return;

    this.set("loading", true);
    this.store
      .find("webinar", this.webinarId)
      .then(results => {
        this.setProperties({
          loading: false,
          webinar: results
        });
        this.timerDisplay();
        this.messageBus.subscribe(this.messageBusEndpoint, data => {
          this.webinar.set("status", data.status);
        });
      })
      .catch(e => {
        this.set("loading", false);
      });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.messageBus.unsubscribe(this.messageBusEndpoint);
    clearInterval(this.interval);
  },

  timerDisplay() {
    const starts_at = moment(this.webinar.starts_at);
    if (this.webinar.status !== this.NOT_STARTED) {
      return false;
    }

    this.interval = setInterval(() => {
      const duration = moment.duration(starts_at.diff(moment()));
      this.set("cSecs", duration.seconds());
      this.set("cMins", duration.minutes());
      this.set("cHours", duration.hours());
      this.set("cDays", parseInt(duration.asDays()));

      if (starts_at.isBefore(moment())) {
        this.set("showTimer", false);
        clearInterval(this.interval);
      } else {
        this.set("showTimer", true);
      }
    }, 1000);
  },

  @discourseComputed("webinar")
  messageBusEndpoint(webinar) {
    return `/zoom/webinars/${webinar.zoom_id}`;
  },

  @discourseComputed("webinar.{starts_at,webinar.ends_at}")
  schedule(webinar) {
    return formattedSchedule(webinar.starts_at, webinar.ends_at);
  },

  actions: {
    editPanelists() {
      showModal("edit-webinar", {
        model: this.webinar,
        title: "zoom.edit_webinar"
      });
    }
  }
});
