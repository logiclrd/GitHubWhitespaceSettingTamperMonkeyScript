// ==UserScript==
// @name         GitHub Diff Whitespace Setting
// @namespace    http://iqmetrix.net/logiclrd/
// @version      0.1
// @description  Alter GitHub's URLs to diffs to include the whitespace-ignoring option, if enabled.
// @author       Jonathan Gilbert
// @match        https://github.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    var flag = GM_getValue("GitHubDiffWhitespace", false);

    var i;

    var links = document.getElementsByTagName("a");

    if (flag)
    {
        for (i = 0; i < links.length; i++)
        {
            var link = links[i];

            if (/^(https:\/\/github.com)?\/\w+\/\w+\/pull\/\d+\/commits\/[0-9a-f]+$/.test(link.href))
            {
                if (link.href.indexOf('?') >= 0)
                    link.href += "&w=1";
                else
                    link.href += "?w=1";
            }
        }
    }

    var summaries = document.getElementsByTagName("summary");

    for (i = 0; i < summaries.length; i++)
    {
        if (summaries[i].innerText.trim() == "Diff settings")
        {
            var diffSettingsDetails = summaries[i].parentElement;

            var headings = diffSettingsDetails.getElementsByTagName("h4");

            var toggleHeader = document.createElement("p");

            toggleHeader.style.margin = "10px 0 0 0";
            toggleHeader.innerText = "Whitespace:";

            var toggleButton = document.createElement("div");

            var insertBefore = null;

            var j;

            for (j = 0; j < headings.length; j++)
            {
                if (headings[j].innerText.trim() == "Always")
                {
                    if (j + 1 < headings.length)
                        insertBefore = headings[j + 1];
                    else
                        insertBefore = null;

                    break;
                }
            }

            insertBefore.parentElement.insertBefore(toggleHeader, insertBefore);
            insertBefore.parentElement.insertBefore(toggleButton, insertBefore);

            toggleButton.outerHTML =
"<div class=\"BtnGroup d-flex flex-content-stretch js-diff-whitespace-toggle\">"
+ "<label class=\"flex-auto btn btn-sm BtnGroup-item text-center" + (flag ? " selected" : "") + "\"><input class=\"sr-only\" value=\"1\" name=\"w\" type=\"radio\"" + (flag ? " checked=\"checked\"" : "") + ">Hide</label>"
+ "<label class=\"flex-auto btn btn-sm BtnGroup-item text-center" + (flag ? "" : " selected") + "\"><input class=\"sr-only\" value=\"0\" name=\"w\" type=\"radio\"" + (flag ? "" : " checked=\"checked\"") + ">Show</label>" +
"</div>";

            toggleButton = insertBefore.parentElement.getElementsByClassName("js-diff-whitespace-toggle")[0];

            var labels = toggleButton.getElementsByTagName("label");
            var inputs = toggleButton.getElementsByTagName("input");

            var justForNowWhitespaceCheckBox = document.getElementById("whitespace-cb");

            for (j = 0; j < inputs.length; j++)
            {
                inputs[j].onclick =
                    function ()
                    {
                        for (var k = 0; k < labels.length; k++)
                        {
                            var inputForLabel = labels[k].getElementsByTagName("input")[0];

                            if (inputForLabel.checked != labels[k].classList.contains("selected"))
                                labels[k].classList.toggle("selected");

                            if (inputForLabel.value == "1")
                                flag = justForNowWhitespaceCheckBox.checked = inputForLabel.checked;
                        }
                    };
            }

            var formElement = insertBefore.parentElement;

            while ((formElement != null) && (formElement.tagName.toLowerCase() != "form"))
                formElement = formElement.parentElement;

            if (formElement != null)
            {
                formElement.addEventListener(
                    "submit",
                    function ()
                    {
                        GM_setValue("GitHubDiffWhitespace", flag);
                    });
            }
        }
    }
})();