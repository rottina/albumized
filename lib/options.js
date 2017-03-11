function restoreSaveText() { document.getElementById('submit').value = 'Save'; }
function restoreDefaults() { document.getElementById('defaults').value = 'Set Deafults';location.reload(); }

function saveOptions() {
  localStorage['albumized_pref_bgcolor'] = document.getElementById('albumized_pref_bgcolor').value;
  localStorage['albumized_pref_ballcolor'] = document.getElementById('albumized_pref_ballcolor').value;
  localStorage['albumized_pref_balltotal'] = document.getElementById('albumized_pref_balltotal').value;
  localStorage['albumized_pref_density'] = document.getElementById('albumized_pref_density').value;
  localStorage['albumized_pref_gravity'] = document.getElementById('albumized_pref_gravity').value;
  localStorage['albumized_pref_friction'] = document.getElementById('albumized_pref_friction').value;
  localStorage['albumized_pref_restitution'] = document.getElementById('albumized_pref_restitution').value;
  localStorage['albumized_pref_sheep'] = document.getElementById('albumized_pref_sheep').checked;
  document.getElementById('submit').value = 'Saved!';setTimeout(restoreSaveText, 1776);
}
function restoreOptions() {
  var pbg = localStorage['albumized_pref_bgcolor'];
  var myPicker = new jscolor.color(document.getElementById('albumized_pref_bgcolor'),{});
  if (!pbg) { myPicker.fromString('101019'); } else { myPicker.fromString(pbg);}

  var pball = localStorage['albumized_pref_ballcolor'];
  var myPicker2 = new jscolor.color(document.getElementById('albumized_pref_ballcolor'),{});
  if (!pball) { myPicker2.fromString('1A2433'); } else { myPicker2.fromString(pball);}

  var pdense = localStorage['albumized_pref_density'];
  var myDensity = document.getElementById('albumized_pref_density');
  if (!pdense) { myDensity.value = '1.0'; } else { myDensity.value = pdense; }

  var pfric = localStorage['albumized_pref_friction'];
  var myFriction = document.getElementById('albumized_pref_friction');
  if (!pfric) { myFriction.value = '0.3'; } else { myFriction.value = pfric; }

  var pgrav = localStorage['albumized_pref_gravity'];
  var myGravity = document.getElementById('albumized_pref_gravity');
  if (!pgrav) { myGravity.value = '9'; } else { myGravity.value = pgrav; }

  var prestitution = localStorage['albumized_pref_restitution'];
  var myRestitution = document.getElementById('albumized_pref_restitution');
  if (!prestitution) { myRestitution.value = '0.3'; } else { myRestitution.value = prestitution; }

  var btotal = localStorage['albumized_pref_balltotal'];
  var myBallTotal = document.getElementById('albumized_pref_balltotal');
  if (!btotal) { myBallTotal.value = '15'; } else { myBallTotal.value = btotal; }

  var kabob = localStorage['albumized_pref_sheep'];
  if (kabob === 'true') {
    $('#albumized_pref_sheep').prop('checked', true);
  } else {
    $('#albumized_pref_sheep').prop('checked', false);
  }
}
function setDefaultOptions() {
  localStorage.clear();
  document.getElementById('defaults').value = 'Defaults Restored!';
  setTimeout(restoreDefaults, 1776);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('#submit').addEventListener('click', saveOptions);
document.querySelector('#defaults').addEventListener('click', setDefaultOptions);
if (localStorage['albumized_pref_sheep'] === 'true') {
  $('header').addClass('sheep').attr('title','Kabob!');
}
