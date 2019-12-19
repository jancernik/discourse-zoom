# frozen_string_literal: true

class FakeZoom
  def initialize(succesful_response: true)
    @succesful_response = succesful_response
  end

  def webinar(_webinar_id)
    raw_start_datetime = "2019-12-31T20:00:00Z"
    start_datetime = DateTime.parse(raw_start_datetime)
    duration = 60

    {
      title: 'Test webinar',
      starts_at: start_datetime,
      ends_at: start_datetime + duration.minutes,
      duration: duration,
      host_id: '111111111111'
    }
  end

  def host(_host_id)
    {
      full_name: 'Roman Rizzi',
      avatar_url: 'https://test-cdn.com/roman/120/23782_2.png',
      email: 'roman@test.org'
    }
  end

  def speakers(_webinar_id)
    {
      speakers: [{
        email: "mark@test.org",
        name: "Mark"
      }],
      speakers_count: 1
    }
  end
end
