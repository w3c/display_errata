
# Using Github issues to handle errata in Recommendations

This is a simple file with some associated scripts to handle Errata for published Recommendations. The "model" is as follows:

* Errata are raised and managed in a github repository (“errata repository” in what follows). This often means re-using the repository used by a Working Group, but that is not required.
* There is a selected group of administrators (not only the team…) that can change the labels for issues in the repository.

Note that the workflow describes the case whereby a single repository is used for several documents. In case the Working Group follows the separate repository per document model, an errata file must be installed separately for each document.

## How does it work for the user

Raising and managing errata is done as follows. Note that the approach below is for a case when the errata repository is used for several recommendations (identifed by separate labels, `Model` and `Vocab` in the example below). Obviously, if a separate errata repository is used for separate documents, that approach can be simplified.

* Errata are introduced and stored in the issue list of the dedicated repository. The workflow to add a new erratum is as follows:
    * An issue is raised for a possible erratum. The label of the issue SHOULD be set to “`ErratumRaised`”. It SHOULD also include the label corresponding to the document on which the erratum is raised, e.g., “`Model`” or “`Vocab`”. It is o.k. for an erratum to have several labels. In some, exceptional, cases, i.e., when the erratum is very general, it is also acceptable not to have a reference to a document.
    * The community discusses the issue. If it is accepted as a genuine erratum, the label “`Errata`” is added to the entry and the “`ErratumRaised`” label should be removed. Additionally, a new comment on the issue MAY be added, beginning with the word "Summary:" (if such a summary is useful based on the discussion).
    * If the community rejects the issue as an erratum, the issue should be closed.
    * Each errata may be labelled as “`Editorial`”; editorial errata are listed separately from the substantial ones.

That is it. When the `index.html` is fetched, it displays the list of accepted errata, possibly with a summary, and categorized by document. That `index.html` file can be used as the official errata reference in the Recommendation’s header.

## Installation

The `index.html` file must be adapted. Apart from the obvious changes (setting the right title, reference to the Working Group, etc), the following attribute values must be set in the source:

* `@data-githubrepo`, to be set on the `<head>` element to the repository name. For W3C repositories the name is usually of the form `w3c/@@@`, though there are groups that use a different “organization”.
* `@data-erratalabel` must be set _on each_ top level `<section>` elements, except for the last one, within the `<main>` element. The value should be the label used in the errata repository for the specific document. The last section should be left as is, used by possible errata that are not explicitly assigned to a document.

## Examples

There is a ”test” version in this repository (it relies on the errata repository of the CSV on the Web WG):

https://w3c.github.io/display_errata/test.html

There are also some past Working Groups that have been using the mechanism (though possibly earlier versions thereof), see:

* CSV on the Web Working Group: https://www.w3.org/2013/csvw/errata/
* Web Annotation Working Group: https://www.w3.org/annotation/errata/
* Permissions & Obligations Expression Working Group: https://www.w3.org/2016/poe/errata/
