$(document).ready( function() {   
  /* taskHtml takes in a JavaScript (JSON) representation of the task and produces an
     HTML representation using the <li> tag.
  */
  function taskHtml(task) {
     var checkedStatus = task.done ? 'checked' : '';
     var checkboxInput = '<input class="toggle" type="checkbox"' +"data-id='" +task.id+ "'" +checkedStatus+ '>';
     var liElement = '<li><div class="view">' + checkboxInput +
                     '<label>' + task.title+ '</label>' +
                     '</div></li>';
    return liElement;
  }

  /* taskToggle is called through jQuery .change when the user checks or unchecks the
     checkbox identified by class='toggle'. Refer to function taskHtml for the checkbox.
     This function receives the event from .change and toggles the checkbox. It performs
     a API request (PUT overriding jQuery$.post) to update the task's record in the Task table.
  */
  function taskToggle(event) {
    var itemId = $(event.target).data('id');
    var doneValue = Boolean($(event.target).is(':checked'));
    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: { done: doneValue }
    });
  }

  /* Gets all the tasks in the Task table and displays each one on the index page in a <li> element */
  $.get('/tasks').success( function(data)  {
    var htmlString = '';
    $.each(data, function(index, task) {
      console.log("each loop. index: " +index +'\ttask id: ' +task.id+ '\ttitle: ' +task.title+ '\tdone: ' +task.done);     
      htmlString += taskHtml(task);
    });
    var ulTodos = $('.todo-list');
    ulTodos.html(htmlString);

    $('.toggle').change(taskToggle);     
  });   // end $.get

  /* Adds the new task to table TASK with jQuery $.post when user presses the enter key
     inside the form. Appends this new task to the list on the index page, and calls the
     toggle click function so that the user could immediately toggle the checkbox
  */
  $('#new-form').submit(function(event) {
    event.preventDefault();
    $.post('/tasks', { task: {title: $('.new-todo').val()} }).success(function(data) {
      $('.todo-list').append(taskHtml(data));
      $('.toggle').click(taskToggle);
    });
  });   // end new-form submit

});   // end document ready