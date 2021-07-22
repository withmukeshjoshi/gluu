# Gluu - A lightweight HTML Framework

**What is Gluu?**
Gluu is a lightweight html compiler which help in maintaining large html/css/js projects by using partials.

**What is a partial?**
Partial is a reusable code which you can use throughout the project. for example header, footer, sidebar can be shared between all pages.

**Benefits of Partials?**
Partial allows you writing clean, fast and maintainable code.

### Prerequisites?
Gluu is one of the simple HTML framework that you will use.
 - npm

## Installation

```javascript
npm install gluu
```
create a gluu config file by running  below command:
```javascript
gluu init
```
you can manually create a **gluu.config.json** file and a folder named **partials** at the project root.
```html
<!DOCTYPE  html>
<html  lang="en">
<head>
<meta  charset="UTF-8">
<meta  http-equiv="X-UA-Compatible"  content="IE=edge">
<meta  name="viewport"  content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
<!-- Basic Example of Implementing Partials -->
<!-- gluu will search demo.html file inside the "partials" folder -->
<partial  name="demo.html" />
</body>
</html>
```
### You can also pass parameters to a partial

```html
<partial  name="demo.html" heading="This is a h1 heading" />
```
to use the parameter in partial file simply use **{parameter}**

```html
<!-- demo.html -->
<h1>{heading}</h1>
```