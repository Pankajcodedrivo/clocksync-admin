declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}
declare module "*.svg" {
  const content: any; // eslint-disable-line
  export default content;
}
declare module "*.png" {
  const content: any; // eslint-disable-line
  export default content;
}
declare module "*.jpg" {
  const content: any; // eslint-disable-line
  export default content;
}
