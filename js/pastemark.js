var base_url = "http://pastemark.nevkontakte.com/";

var template = {
  "id":function(id, text)
  {
    document.getElementById(decodeURI(id)).value = decodeURI(text) + document.getElementById(decodeURI(id)).value;
    document.getElementById(decodeURI(id)).focus();
  },
  "name":function(name, text){
    var fields = document.getElementsByName(name);
    for(var i = 0; i < fields.length; i++)
    {
      if(i == 0)
      {
        fields[i].focus();
      }
      fields[i].value = decodeURI(text) + fields[i].value;
    }
  },
  "click":function(dummy, text){
    var fields = [];
    var textareas = document.getElementsByTagName("textarea");
    var inputs = document.getElementsByTagName("input");

    for(var i = 0; i < textareas.length; i++)
    {
      fields.push(textareas[i]);
    };

    for(var i = 0; i < inputs.length; i++)
    {
      if(inputs[i].type == "text" || inputs[i].type == "password")
      {
        fields.push(inputs[i]);
      }
    };

    // Set up body
    var body_cursor = document.body.style.cursor;
    document.body.style.cursor = "crosshair";

    var body_onclick = document.body.onclick;
    document.body.onclick = function()
    {
      // Restore body
      document.body.style.cursor = body_cursor;
      document.body.onclick = body_onclick;

      // Restore other fields
      for(var i = 0; i < fields.length; i++)
      {
        fields[i].style.cursor = fields[i].style_cursor_pm_save;
        fields[i].style_cursor_pm_save = undefined;

        fields[i].onclick = fields[i].onclick_pm_save;
        fields[i].onclick_pm_save = undefined;
      }
    };

    for(var i = 0; i < fields.length; i++)
    {
      fields[i].style_cursor_pm_save = fields[i].style.cursor;
      fields[i].style.cursor = "crosshair";

      fields[i].onclick_pm_save = fields[i].onclick;
      fields[i].onclick = function()
      {
        // Paste text
        this.value = decodeURI(text) + this.value;
        this.focus();

        // Restore body
        document.body.style.cursor = body_cursor;
        document.body.onclick = body_onclick;

        // Restore other fields
        for(var i = 0; i < fields.length; i++)
        {
          fields[i].style.cursor = fields[i].style_cursor_pm_save;
          fields[i].style_cursor_pm_save = undefined;

          fields[i].onclick = fields[i].onclick_pm_save;
          fields[i].onclick_pm_save = undefined;
        }
      }
    }
  }
};

var pm_fast = function(base_url){
    var fields = [];
    var textareas = document.getElementsByTagName("textarea");
    var inputs = document.getElementsByTagName("input");

    for(var i = 0; i < textareas.length; i++)
    {
      fields.push(textareas[i]);
    };

    for(var i = 0; i < inputs.length; i++)
    {
      if(inputs[i].type == "text" || inputs[i].type == "password")
      {
        fields.push(inputs[i]);
      }
    };

    // Set up body
    var body_cursor = document.body.style.cursor;
    document.body.style.cursor = "crosshair";

    var body_onclick = document.body.onclick;
    document.body.onclick = function()
    {
      // Restore body
      document.body.style.cursor = body_cursor;
      document.body.onclick = body_onclick;

      // Restore other fields
      for(var i = 0; i < fields.length; i++)
      {
        fields[i].style.cursor = fields[i].style_cursor_pm_save;
        fields[i].style_cursor_pm_save = undefined;

        fields[i].onclick = fields[i].onclick_pm_save;
        fields[i].onclick_pm_save = undefined;
      }
    };

    for(var i = 0; i < fields.length; i++)
    {
      fields[i].style_cursor_pm_save = fields[i].style.cursor;
      fields[i].style.cursor = "crosshair";

      fields[i].onclick_pm_save = fields[i].onclick;
      fields[i].onclick = function()
      {
        //
        // Analyze target
        //
        var idby = "click";
        var target = "";
        if(this.id)
        {
          idby = "id";
          target = encodeURIComponent(this.id);
        }
        else if(this.name)
        {
          idby = "name";
          target = encodeURIComponent(this.name);
        }

        var snippet = encodeURIComponent(this.value);

        titles = document.getElementsByTagName("h2");
        if(titles.length == 0)
        {
          titles = document.getElementsByTagName("h1");
          if(titles.length == 0)
          {
            titles = document.getElementsByTagName("title");
          }
        }

        var title = "";
        if(titles.length != 0)
        {
          title = encodeURIComponent(titles[0].innerHTML);
        }

        var url = base_url + "?title="+title+"&idby="+idby+"&target="+target+"&snippet="+snippet;
        window.open(url);
        // Restore body
        document.body.style.cursor = body_cursor;
        document.body.onclick = body_onclick;

        // Restore other fields
        for(var i = 0; i < fields.length; i++)
        {
          fields[i].style.cursor = fields[i].style_cursor_pm_save;
          fields[i].style_cursor_pm_save = undefined;

          fields[i].onclick = fields[i].onclick_pm_save;
          fields[i].onclick_pm_save = undefined;
        }
      }
    }
  }

function make_pastemark()
{
  $(".pm-error").hide();
  $("#pm-ready-wrapper").hide();

  // Collect & validate data
  var title = $("#pm-title").val();
  var idby = $("#pm-form input[name=pm-id]:checked").val();
  var target = $("#pm-target").val();
  var snippet = $("#pm-snippet").val();

  var error = false;

  if(title == "")
  {
    $("#pm-error-title").show().text("Please enter bookmarklet title");
    error = true;
  }

  if(idby == null)
  {
    $("#pm-error-id").show().text("Please choose one");
    error = true;
  }

  if(idby != null && idby != "click" && target == "")
  {
    $("#pm-error-target").show().text("Please specify target field "+idby);
    error = true;
  }

  if(snippet == "")
  {
    $("#pm-error-snippet").show().text("Please enter text to be pasted");
    error = true;
  }

  if(error)
  {
    return;
  }

  // Optimize code to one line
  var code = template[idby].toString().replace(/\/\/.*/g, "").replace(/\/\*[\s\S]*\*\//, "").replace(/\n/g, " ").replace(/\s+/g, " ");
  var link = "javascript:void("+code+"('"+encodeURI(target)+"', '"+encodeURI(snippet)+"'))";

  $("#pm-ready").text(title).attr("href", encodeURI(link));
  $("#pm-ready-wrapper").show();
}

$(document).ready(function(){
  // Enable navigation
  var menu_items = $("#topmenu a");
  menu_items.click(function(){
    var self = $(this);
    var target = self.attr("href")

    if(target.substr(0,1) != "#")
    {
      return true;
    }

    if(self.hasClass("selected"))
    {
      return false;
    }

    menu_items.each(function(){
      var self = $(this);
      self.removeClass("selected");
      var target = self.attr("href");
      if(target.substr(0,1) == "#")
      {
        $(target).hide();
      }
    });

    self.addClass("selected");
    $(target).show();

    return true;
  });

  if(document.location.hash != "")
  {
    var target = document.location.hash;
    menu_items.each(function(){
      var self = $(this);
      if(self.attr("href") == target)
      {
        self.addClass("selected");
        $(self.attr("href")).show();
      }
      else
      {
        self.removeClass("selected");
        $(self.attr("href")).hide();
      }
    });
  }

  $("#pm-form").submit(function(){
    make_pastemark();
    return false;
  });
  $("#pm-form input[type=submit]").removeAttr("disabled");

  $("#pm-form input[name=pm-id]").change(function(){
    if($("#pm-form input[name=pm-id]:checked").val() != "click")
    {
      $("#pm-target-wrapper").show();
    }
    else
    {
      $("#pm-target-wrapper").hide();
    }
  });

  $("#pm-form input[type=reset]").click(function(){
    $(".pm-error").hide();
    $("#pm-target-wrapper").hide();
    $("#pm-ready-wrapper").hide();
  });

  // Fill fields from request
  var params = $.getUrlVars();
  if(params["idby"] != undefined)
  {
    if($("#pm-id-"+params["idby"]).size() != 0)
    {
      $("#pm-id-"+params["idby"]).click();
      $("#pm-id-"+params["idby"]).change();
    }

    if(params["title"] != undefined)
    {
      $("#pm-title").val(params["title"]);
    }

    if(params["target"] != undefined)
    {
      $("#pm-target").val(params["target"]);
    }

    if(params["snippet"] != undefined)
    {
      $("#pm-snippet").val(params["snippet"]);
    }
  }

  // Attach Pastemark Fast! links
  var code = pm_fast.toString().replace(/\/\/.*/g, "").replace(/\/\*[\s\S]*\*\//, "").replace(/\n/g, " ").replace(/\s+/g, " ");
  var link = "javascript:void("+code+"(\""+base_url+"\"))";

  $(".fast-tool").attr("href", encodeURI(link));
});

//
// Based on snippet from
// http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
//

$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = [];
    if(window.location.href.lastIndexOf('#') != -1)
    {
      hashes = window.location.href.slice(window.location.href.indexOf('?') + 1, window.location.href.lastIndexOf('#')).split('&');
    }
    else
    {
    hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    }
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      hash[0] = decodeURIComponent(hash[0]);
      hash[1] = decodeURIComponent(hash[1]);
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});
