export async function readImagesAfterLoad(page) {
  await page.evaluate(async () => {
    const images = [...document.images];
    for (const image of images) image.loading = "eager";

    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((resolve) =>
      window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)),
    );

    await Promise.all(
      images.map(
        (image) =>
          new Promise((resolve) => {
            if (image.complete) {
              resolve();
              return;
            }
            const finish = () => resolve();
            image.addEventListener("load", finish, { once: true });
            image.addEventListener("error", finish, { once: true });
            setTimeout(finish, 2500);
          }),
      ),
    );
    window.scrollTo(0, 0);
  });

  return await page.evaluate(() =>
    [...document.images].map((image) => ({
      complete: image.complete,
      naturalWidth: image.naturalWidth,
      src: image.src,
    })),
  );
}
