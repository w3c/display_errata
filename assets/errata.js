/*
Script to create errata report pages based on github issues used to raise an errata.

The workflow on github is as follows:

- An issue is raised. Additionally, a label is added to designate a specific label defined by for the
repository (typically a reference to a specific document). A specific label may be assigned by the specific group for the repo to
differentiate the raised errata from the other issues.
- The community discusses the issue. If it is accepted as a genuine erratum, the label "Errata" is added to the entry. Additionally,
a new comment on the issue may be added beginning with the word "Summary".
- If the community rejects the issue as an erratum, the issue is closed.

As for the report, the structure of the HTML file can be seen in the index.html file. The net result is
that the active issues are displayed in different sections, depending on the presence of specific labels. The relevant values are set
through some data-* attributes on the elements.

*/

$(document).ready(() => {
    const display_issue = (node, issue, comments, labels) => {
        const display_labels = labels.filter((label) => label !== 'Errata').join(', ');
        const div = $('<div class="issue"></div>');
        node.append(div);
        div.append(`<h3>"${issue.title}"</h3>`);

        let state = 'Open';
        let state_class = 'state_open';
        if (issue.state !== 'open') {
            state = 'Closed';
            state_class = 'state_closed';
        }

        let pull_request = (issue.pull_request === undefined) ? "No" : "Yes";

        div.append(`<p><span class='what'>Issue number:</span> <a href='${issue.html_url}'>#${issue.number}</a><br>` +
                   `<span class='what'>Raised by:</span> <a href='${issue.user.url}'>@${issue.user.login}</a><br>`   +
                   `<span class='what'>Extra labels:</span> ${display_labels}<br>`                                   +
                   `<span class='what'>Pull request? </span> ${pull_request}<br>`                                    +
                   `<span class='what'>Status:</span> <span class="${state_class}">${state}</span><br> `             +
                   '</p>');
        div.append(`<p><span class='what'><a href='${issue.html_url}'>Initial description:</a></span> ${issue.body}</p>`);

        // See if a summary has been added to the comment.
        let summary = undefined;
        comments.forEach((comment) => {
            if( comment.body.search('^Summary:') !== -1 ) {
                summary = comment;
            }
        });

        if( summary !== undefined ) {
            // @ts-ignore
            const summary_text = summary.body.substr('Summary:'.length)
            // @ts-ignore
            div.append(`<p><span class='what'><a href='${summary.html_url}'>Erratum summary:</a></span> ${summary_text}</p>`);
        }
    }

    const render_issue = (issue, comments) => {
        const labels = issue.labels.map((obj) => {
            return obj.name;
        });
        const get_subsection = (node, lbls) => lbls.includes('Editorial') ? node.children('section:last-of-type') : node.children('section:first-of-type');

        let displayed = false;
        $('main > section').each(function(index) {
            const dataset = $(this).prop('dataset');
            if (labels.includes(dataset.erratalabel)) {
                const subsect = get_subsection($(this), labels);
                display_issue(subsect, issue, comments, labels)
                displayed = true;
            }
        });
        if( displayed === false ) {
            $('main > section').each(function(index) {
                const dataset = $(this).prop('dataset');
                if( dataset.nolabel !== undefined ) {
                    const subsect = get_subsection($(this), labels);
                    display_issue(subsect, issue, comments, labels)
                }
            });
        }
    }


    const dataset = $('head').prop('dataset');
    if (dataset.githubrepo !== undefined) {
        const url_api    = `https://api.github.com/repos/${dataset.githubrepo}/issues?state=all&labels=Errata`;
        const url_issues = `https://github.com/${dataset.githubrepo}/labels/Errata`;
        $.getJSON(url_api, (allIssues) => {
            if( allIssues.length > 0 ) {
                const latest_change = moment.max(allIssues.map((item) => {
                    return moment(item.updated_at)
                }));
                $('span#date').append(latest_change.format('dddd, MMMM Do YYYY'));
            } else {
                $('span#date').append('N/A');
            }
            $('span#number').append(allIssues.length);
            $('span#errata_link').append(`<a href='${url_issues}'>${url_issues}</a>`);
            $.each(allIssues, (i, issue) => {
                $.getJSON(issue.comments_url, (comments) => {
                    render_issue(issue, comments);
                });
            });
        });
    }
});
