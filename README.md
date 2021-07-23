# Gluu - Lightweight HTML Framework

**What is Gluu?**
Gluu is a lightweight html compiler which help in maintaining large html/css/js projects by using partials.
Gluu help writing clean and maintainable code. Sometime you dont want to use heavy frameworks but need features like partials and two way communication.

**What is a partial?**
Partial is a reusable code which you can use throughout the project. for example header, footer, sidebar can be shared between all pages. It will make the code more readable and easy to maintain.

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

There are times when you need to add some style/script dependencies to partial but do not want them to be included in the complied file. In most of the cases its because the main file already has the code.
to prevent the duplicate code added to the complied html, use ignore tag.
```html
<!-- any partial can have it -->
<ignore>
<!-- your script/style here -->
</ignore>
```

## Future Goals
 - [ ] add content to head/footer from the partial
 - [ ] pass content to partial


### For feedback and query, please write to admin@iammukesh.com

### I also make youtube videos :) https://youtube.com/askmj