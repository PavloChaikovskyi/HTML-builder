const fs = require('fs');
const path = require('path');

// Create project directory
const projectDir = path.join(__dirname, 'project-dist');
if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir);
}

// Copy static assets to dist directory
const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(projectDir, 'assets');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const files = fs.readdirSync(assetsDir);
for (const file of files) {
  const src = path.join(assetsDir, file);
  const dest = path.join(distDir, file);
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Replace component placeholders with component content
const templateFile = path.join(__dirname, 'template.html');
const indexFile = path.join(projectDir, 'index.html');
let templateContent = fs.readFileSync(templateFile, 'utf8');

function replaceComponent(componentName, content) {
  const pattern = new RegExp(`{{${componentName}}}`, 'g');
  templateContent = templateContent.replace(pattern, content);
}

const componentsDir = path.join(__dirname, 'components');
const componentFiles = fs.readdirSync(componentsDir);

for (const componentFile of componentFiles) {
  const componentName = path.parse(componentFile).name;
  const componentContent = fs.readFileSync(path.join(componentsDir, componentFile), 'utf8');
  replaceComponent(componentName, componentContent);
}

fs.writeFileSync(indexFile, templateContent);

// Combine styles into a single file
const stylesDir = path.join(__dirname, 'styles');
const styleFiles = fs.readdirSync(stylesDir);
let styleContent = '';
for (const file of styleFiles) {
  const src = path.join(stylesDir, file);
  if (!fs.statSync(src).isDirectory()) {
    styleContent += fs.readFileSync(src, 'utf8');
  }
}
const styleFile = path.join(projectDir, 'style.css');
fs.writeFileSync(styleFile, styleContent);

console.log('Page is built successfully!');

function copyDir(src, dest) {
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
