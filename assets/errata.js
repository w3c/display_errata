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
        const div = document.createElement('div');
        div.className = 'issue';
        node.append(div);
        div.innerHTML = `<h3>"${issue.title}"</h3>`;

        let state = 'Open';
        let state_class = 'state_open';
        if (issue.state !== 'open') {
            state = 'Closed';
            state_class = 'state_closed';
        }

        const pull_request = (issue.pull_request === undefined) ? "No" : "Yes";
        const p1 = document.createElement('p');
        p1.innerHTML = `<span class='what'>Issue number:</span> <a href='${issue.html_url}'>#${issue.number}</a><br>`  +
                       `<span class='what'>Raised by:</span> <a href='${issue.user.url}'>@${issue.user.login}</a><br>` +
                       `<span class='what'>Extra labels:</span> ${display_labels}<br>`                                 +
                       `<span class='what'>Pull request? </span> ${pull_request}<br>`                                  +
                       `<span class='what'>Status:</span> <span class="${state_class}">${state}</span><br> `           ;
        div.append(p1);

        const p2 = document.createElement('p');
        p2.innerHTML = `<span class='what'><a href='${issue.html_url}'>Initial description:</a></span> ${issue.body}`;
        div.append(p2);

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
            const p3 = document.createElement('p');
            p3.innerHTML = `<span class='what'><a href='${summary.html_url}'>Erratum summary:</a></span> ${summary_text}`;
            div.append(p3);
        }
    }

    const render_issue = (issue, comments) => {
        const labels = issue.labels.map((obj) => obj.name);
        const get_subsection = (node, lbls) => lbls.includes('Editorial') ? node.querySelector('section:last-of-type') : node.querySelector('section:first-of-type');

        let displayed = false;
        const sections = document.querySelectorAll('main > section');

        // first looking for sections corresponding to the main errata labels
        sections.forEach((section) => {
            if (labels.includes(section.dataset.erratalabel)) {
                const subsection = get_subsection(section, labels);
                display_issue(subsection, issue, comments, labels)
                displayed = true;
            }
        });

        if (!displayed) {
            // looking for the 'nolabel' data attribute
            sections.forEach((section) => {
                if (section.dataset.nolabel !== undefined) {
                    const subsection = get_subsection(section, labels);
                    display_issue(subsection, issue, comments, labels)
                    displayed = true;
                }
            });
        }
    }

    // @@@ TODO: get over the fetch thing for getting a JSON, and use this
    // For this, it may be cleaner to get the two functions above into a separate function and what is below becomes then an
    // async function to be invoked separately... But then again, maybe not, just have an overall function instead of the top level thingy...

    // Also: the json return may not always be in order. Maybe sorting these by time makes sense!

    const dataset = document.getElementsByTagName('head')[0].dataset;
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
