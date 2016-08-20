## Nested Routes

routes for the comments are not intuitive like they are for each campground. Instead, the ID is required so that we can reference it to add the ID to the comments model

NEW       campgrounds/:id/comments/new    GET
CREATE    campgrounds/:id/comments        POST
