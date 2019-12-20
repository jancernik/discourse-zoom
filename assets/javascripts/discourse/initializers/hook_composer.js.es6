// import { observes, on } from "discourse-common/utils/decorators";
// import { ajax } from "discourse/lib/ajax";
import Composer from "discourse/models/composer";

export default {
  name: "hook-composer",

  initialize() {
    // Register custom fields to be saved for new post.
    Composer.serializeOnCreate("zoom_webinar_id", "zoomWebinarId");
    Composer.serializeOnCreate("zoom_webinar_attributes", "zoomWebinarAttributes");
    Composer.serializeOnCreate("zoom_webinar_host", "zoomWebinarHost");
    Composer.serializeOnCreate("zoom_webinar_speakers", "zoomWebinarSpeakers");
  }
};
