
# Using Github issues to handle errata in Recommendations

This is a simple file with some associated scripts to handle Errata for published Recommendations. The "model" is as follows:

* Errata are raised and managed in a github repository (“errata repository” in what follows). This often means re-using the repository used by a Working Group, but that is not required. 
* There is a selected group of administrators (not only the team…) that can change the labels for issues in the repository.

## How does it work for the user

Raising and managing errata is done as follows. Note that the approach below is for a case when the errata repository is used for several recommendations (identifed by separate labels, `Model` and `Vocab` in the example below). Obviously, if a separate errata repository is used for separate documents, that approach can be simplified.

* Errata are introduced and stored in the issue list of the dedicated repository. The workflow to add a new erratum is as follows:
    * An issue is raised for a possible erratum. The label of the issue SHOULD be set to “`ErratumRaised`”. It SHOULD also include the label corresponding to the document on which the erratum is raised, e.g., “`Model`” or “`Vocab`”. It is o.k. for an erratum to have several labels. In some, exceptional, cases, i.e., when the erratum is very general, it is also acceptable not to have a reference to a document.
    * The community discusses the issue. If it is accepted as a genuine erratum, the label “`Errata`” is added to the entry and the “`ErratumRaised`” label should be removed. Additionally, a new comment on the issue MAY be added, beginning with the word "Summary:" (if such a summary is useful based on the discussion).
    * If the community rejects the issue as an erratum, the issue should be closed.

That is it. When the `index.html` is fetched, it displays the list of accepted errata, possibly with a summary, and categorized by document. That `index.html` file can be used as the official errata reference in the Recommendation’s header.

## Installation

The `index.html` file must be adapted. Apart from the obvious changes (setting the right title, reference to the Working Group, etc), the following attribute values must be set:

* `@data-githubrepo`, to be set on the `<head>` element to the repository name. For W3C repositories the name is usually of the form `w3c/@@@`, though there are groups that use a different “organization”.
* `@data-erratalabel` must be set on each `<section>` elements, except for the last one, within the `<main>` element. The value should be the label used in the errata repository for the specific document. The last section should be stayed as is, used by possible errata that are not explicitly assigned to a document.

## Examples 

There are some past Working Groups that have been using the mechanism for a while, see:

* CSV on the Web Working Group: https://www.w3.org/2013/csvw/errata/
* Web Annotation Working Group: https://www.w3.org/annotation/errata/
* Permissions & Obligations Expression 
Working Group: https://www.w3.org/2016/poe/errata/



