import html2canvas from 'html2canvas';

export const downloadCanvas = async (stage: any, resolution: string, bgColor: string) => {
  const canvas = await html2canvas(stage.container(), {
    backgroundColor: bgColor,
    scale: 2, // Higher res
    width: stage.width(),
    height: stage.height(),
  });
  const link = document.createElement('a');
  link.download = `wallpaper-${resolution}.png`;
  link.href = canvas.toDataURL();
  link.click();
};