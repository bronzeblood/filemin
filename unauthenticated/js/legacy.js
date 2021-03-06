$( document ).ready(function() {
/*
    $( "input[title]" ).tooltip({
        position: {
            my: "left top",
            at: "right+5 top-5"
        }
    });
/*
    $( "a[title]" ).tooltip({
        position: {
            my: "bottom center",
            at: "bottom+30"
        }
    });*/
    $('tr').removeAttr('onmouseover');
    $('tr').removeAttr('onmouseout');
    $('input').removeAttr('onclick');
    $('#select-unselect').change(function() { selectUnselect($(this)); });
});

window.onload = function() {
    var checkboxes = document.getElementsByClassName('ui_checkbox');
    for(var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].onclick = function() {
            var row = this.parentNode.parentNode;
            if (this.checked) {
                row.className = row.className + ' checked';
            }
            else {
                row.className = row.className.replace(' checked', '');
            }
        };
    }
}

function countUploads(files) {
    if(files.files.length = 0) return;
    var info = '';
    for (i = 0; i < files.files.length; i++) {
        info += files.files[i].name + '<br>';
    }
    $('#readyForUploadList').html(info);
}

function selectAll() {
    var rows = document.getElementsByClassName('ui_checked_columns');

    for (i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input')[0];
        if (!input.checked) {
            rowClick(rows[i]);
        }
    }
}

function invertSelection() {
    var rows = document.getElementsByClassName('ui_checked_columns');

    for (i = 0; i < rows.length; i++)
        rowClick(rows[i]);
}

function compressDialog() {
    if(checkSelected()) {
      $( "#compressDialog" ).dialog({
          modal: true,
          buttons: {
              "Compress": function() {
                  compressSelected();
              },
              "Cancel": function() {
                  $( this ).dialog( "close" );
              }
          }
      });
    }
}

function compressSelected() {
    var filename = $('#compressSelectedForm input[name=filename]').val();
    if (filename != null && filename != "") {
        $('#list_form').attr('action', "compress.cgi?arch=" + filename);
        $('#list_form').submit();
    }
}

function removeSelected() {
    if(checkSelected()) {
        $('#items-to-remove').html('');

        $(".ui_checked_checkbox input[type='checkbox']:checked").each(function() {
        $('#items-to-remove').append($(this).val() + '<br>');
        });

        $( "#removeDialog" ).dialog({
            modal: true,
            buttons: {
                "YES": function() {
                    document.forms['list_form'].action = "delete.cgi";
                    document.forms['list_form'].submit();
                },
                "NO": function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    }
}

function chmodDialog() {
    if(checkSelected()) {
      $( "#chmodDialog" ).dialog({
          modal: true,
          buttons: {
              "Change": function() {
                  chmodSelected();
              },
              "Cancel": function() {
                  $( this ).dialog( "close" );
              }
          }
      });
    }
}

function chmodSelected() {
    var perms = $('#perms').val();
    var recursive = $('#chmod-recursive').prop('checked');
    if (perms != null && perms != "") {
        $('#list_form').attr('action', "chmod.cgi?perms=" + perms + "&recursive=" + recursive);
        $('#list_form').submit();
    }
}

function chownDialog() {
    if(checkSelected()) {
      $( "#chownDialog" ).dialog({
          modal: true,
          buttons: {
              "Change": function() {
                  chownSelected();
              },
              "Cancel": function() {
                  $( this ).dialog( "close" );
              }
          }
      });
    }
}

function chownSelected() {
    var owner = $('#chownForm input[name=owner]').val();
    var group = $('#chownForm input[name=group]').val();
    var recursive = $('#chown-recursive').prop('checked');

    if (owner != null && owner != "" && group != null && group != "") {
        $('#list_form').attr('action', "chown.cgi?owner=" + owner + "&group=" + group + "&recursive=" + recursive);
        $('#list_form').submit();
    }
}

function renameDialog(file) {
    $("#renameForm input[name=name]").val(file);
    $("#renameForm input[name=file]").val(file);
    $( "#renameDialog" ).dialog({
        modal: true,
        buttons: {
            "Rename": function() {
                renameSelected();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function renameSelected() {
    var name = $('#renameForm input[name=name]').val();
    var file = $('#renameForm input[name=file]').val();
    if (name != null && name != "" && name != file) {
        $('#renameForm').submit();
    }
}

function copySelected() {
    if(checkSelected()) {
        document.forms['list_form'].action = "copy.cgi";
        document.forms['list_form'].submit();
    }
}

function cutSelected() {
    if(checkSelected()) {
        document.forms['list_form'].action = "cut.cgi";
        document.forms['list_form'].submit();
    }
}

function viewReadyForUpload() {
    $( "#readyForUploadDialog" ).dialog({
        modal: true,
        buttons: {
            "OK": function() {
                uploadFiles();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function browseForUpload() {
    var files = document.getElementById('upfiles');
    files.click();
    return true;
}

function uploadFiles() {
    var files = document.getElementById('upfiles');
    if (files.files.length > 0)
        $('#upload-form').submit();
    else
        files.click();
}

function createFolderDialog() {
    $( "#createFolderDialog" ).dialog({
        modal: true,
        buttons: {
            "Create": function() {
                createFolder();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function createFolder() {
    var name = $('#createFolderForm input[name=name]').val();
    if (name != null && name != "")
        $("#createFolderForm").submit();
    else {
/*        var tooltip = $('#createFolderForm input[name=name]').tooltip({
            position: {
                my: "left top",
                at: "right+5 top-5"
            }
        });
        tooltip.tooltip('open');*/
        $('#createFolderForm input[name=name]').tooltip('open');
    }
}

function createFileDialog() {
    $( "#createFileDialog" ).dialog({
        modal: true,
        buttons: {
            "Create": function() {
                createFile();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function createFile() {
    var name = $('#createFileForm input[name=name]').val();
    if (name != null && name != "") {
        $("#createFileForm").submit();
    }
}

function downFromUrlDialog() {
    $( "#downFromUrlDialog" ).dialog({
        modal: true,
        buttons: {
            "Download": function() {
                downFromUrl();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function downFromUrl() {
    var link = $('#downFromUrlForm input[name=link]').val();
    if (link != null && link != "")
        $('#downFromUrlForm').submit();
}

function selectUnselect(cb) {
    var rows = $('.ui_checked_columns');
    console.log(cb);
    for (i = 0; i < rows.length; i++) {
        switch(cb.is(":checked")) {
            case true:
                selectRow(rows[i]);
                break;
            case false:
                unselectRow(rows[i]);
                break;
        }
    }
}

function rowClick(row) {
    var input = row.getElementsByTagName('input')[0];
    input.checked = !input.checked;
    if (input.checked) {
        row.className = row.className + ' checked';
    }
    else {
        row.className = row.className.replace(' checked', '');
    }
}

function selectRow(row) {
    var input = row.getElementsByTagName('input')[0];
    if(!input.checked) {
        input.checked = true;
        row.className = row.className + ' checked';
    }
}

function unselectRow(row) {
    var input = row.getElementsByTagName('input')[0];
    if(input.checked) {
        input.checked = false;
        row.className = row.className.replace(' checked', '');
    }
}
function checkSelected() {
    var checkboxes = $('.ui_checkbox');
    for(var i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked) return true;
    }
    $( "#nothingSelected" ).dialog({
        modal: true,
        buttons: {
            "OK": function() {
                $( this ).dialog( "close" );
            }
        }
    });
    return false;
}

/*
function checkSelected() {
    var checkboxes = document.getElementsByClassName('ui_checkbox');
    for(var i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked) return true;
    }
    alert('Nothing selected');
    return false;
}
*/