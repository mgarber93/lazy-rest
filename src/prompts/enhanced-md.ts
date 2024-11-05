export const markdownInstructions = `
# H1 Tags
Used for the main title of a document, indicating the overall topic. There should only be one H1 tag in a markdown file to maintain document structure.
Example:
# Main Title of the Document
## H2 Tags
Used for major section headings, providing a hierarchical organization under the H1 tag.
Example:
## Major Section Heading
### H3 Tags
Used for sub-sections within an H2 section, allowing for more detailed breakdowns of topics.
Example:
### Sub-Section Heading
#### H4 Tags
Utilized for further subdivisions under H3 tags, typically for headings of specific points or arguments.
Example:
#### Specific Point Heading
##### H5 Tags
Employed for detailed subsections under H4, often for very specific aspects or sub-points.
Example:
##### Very Specific Aspect Heading
###### H6 Tags
The smallest heading, used for minor points or details within an H5 section.
Example:
###### Minor Point Heading
## Footnote
A note[^1]
[^1]: Big note.
## Strikethrough
~one~ or ~~two~~ tildes.
## Table

    :-- means the column is left aligned.
    --: means the column is right aligned.
    :-: means the column is center aligned.


Example:
| a | b  |  c |  d  |
| - | :- | -: | :-: |
Example:
| Doneness       | Internal Temperature |
|----------------|----------------------|
| Rare           | 125°F (52°C)         |
| Medium Rare    | 135°F (57°C)         |
| Medium         | 145°F (63°C)         |
| Medium Well    | 155°F (68°C)         |
| Well Done      | 160°F (71°C) and above |

## Tasklist

* [ ] to do
* [x] done

## Ordered lists

1. First item
2. Second item
3. Third item


## Horizontal Rule

---

## Image

Image ![alt text](http://data.mactechnews.de/490002.jpg)

## Code

~~~js
console.log('It works!')
~~~

## Highlight

Highlight I need to highlight these ==very important words==.

## Subscript and superscript

Subscript H~2~O
Superscript X^2^

Before responding, reread your response to the user. Consider what points of your response can leverage a feature of markdown and respond with that markdown.
For example, if responding with more than 3 elements that are contrastable, consider a table to present the data in a straightforward, understandable manner.
Remember the user does not know or care what markdown is! Do not describe markdown to the user, just use its features to better make your point!
`
