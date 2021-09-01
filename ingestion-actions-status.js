/**
 * Splunk Phantom Ingestion and Playbook Actions Status Checker
 * Developer: Harrison Dano <harrisondano@gmail.com>
 *
 * Usage:
 * 1. Login to your Phantom instance
 * 2. Copy and paste this code to the browser's developer console (usually F12)
 * 3. Populate the labels variable with the target label (e.g. "myevents")
 * 4. Set the number of hours ago you want to include in the checking (e.g. 1)
 * 5. Run the script by pressing ENTER
 *
 * You will get the total events for each label and if there are errors,
 * it will show each event id with corresponding error message
 */

var hoursago = 1
var labels = ['myevents']
var labelidx = 0
var curidx = 0
var eventids = []
var erroridx = 0
var errors = []
 
function get_start_time() {
    var now = new Date();
    var h = new Date(now.getTime() - (1000*60*60)*(8+hoursago));
    return h.getFullYear() + "-" + (h.getMonth() + 1) + "-" + h.getDate() + " " + h.getHours() + ":" + h.getMinutes()
}
 
function get_events() {
    if (labelidx >= labels.length) return
    var label = labels[labelidx]
    var params = [
      'page_size=0',
      'sort=id',
      'order=desc',
      `_filter_label=%22${label}%22`,
      `_filter_create_time__gt=%22${get_start_time()}%22`
    ]
    var url = `/rest/container?${params.join('&')}`
    $.ajax({
      url: url
    }).done(function(data) {
      console.log(`Total events for ${label}: ${data.count}`)
      if (data.count > 0) {
        eventids = []
        data.data.forEach(function(e){
          eventids.push(e.id)
        })
        curidx = 0
        get_actions()
      } else {
        labelidx++
        get_events()
      }
    });
}
 
function get_actions() {
    if (curidx >= eventids.length) {
        labelidx++
        get_events()
        return
    }
    var url = `/rest/container/${eventids[curidx]}/actions`
    $.ajax({
      url: url
    }).done(function(data) {
      errors = []
      data.data.forEach(function(a){
          if (a.status != 'success') {
            errors.push({
              "data": a,
              "action": a.action,
              "id": a.id,
              "event_id": eventids[curidx]
            })
          }
      })
      erroridx = 0
      get_errors()
   });
}
 
function get_errors() {
    if (erroridx >= errors.length) {
       curidx++
       get_actions()
        return
    }
    var url = `/rest/action_run/${errors[erroridx].id}/app_runs`
    $.ajax({
      url: url
    }).done(function(data) {
        var e = errors[erroridx]
         console.log('Event: '+e.event_id)
         console.log('Action: '+e.action)
         console.log('Message: "'+data.data[0].message.split('} Message: "')[1])
         console.log('------------')
         erroridx++
        get_errors()
    })
}
 
 
get_events()

