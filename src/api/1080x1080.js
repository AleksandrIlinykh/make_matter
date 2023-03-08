function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("x-api-key", "PX9SAzAlbk8GgtWJPloa5aWMSJYdpqWx4bboNRum");

const requestResultOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

const requestResult = async (id) => {
  const {
    response: { url, status },
  } = await fetch(
    `https://api.shotstack.io/stage/render/${id}`,
    requestResultOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error(error);
    });
  return [url, status];
};

async function reqRep(id) {
  await timeout(15000);
  const [url, status] = await requestResult(id);
  if (url) {
    return url;
  } else {
    if (status === "failed") {
      throw new Error("failed to render!");
    }
    return await reqRep(id);
  }
}

export const get1080x1080 = async (
  names,
  variant = "small",
  format = "gif",
  period,
  repeatNumber,
  coefficient = 3
) => {
  const dimension = {
    small: {
      width: 1080 / coefficient,
      height: 1920 / coefficient,
      fontSize: `${120 / coefficient}px`,
      margin: `${283 / coefficient}px ${267 / coefficient}px ${
        283 / coefficient
      }px ${113 / coefficient}px `,
    },
    medium: {
      width: 1080 / coefficient,
      height: 1080 / coefficient,
      fontSize: `${120 / coefficient}px`,
      margin: `${396 / coefficient}px ${147 / coefficient}px ${
        396 / coefficient
      }px ${67 / coefficient}px `,
    },
    large: {
      width: 1920 / coefficient,
      height: 1080 / coefficient,
      fontSize: `${220 / coefficient}px`,
      margin: `${123 / coefficient}px ${589 / coefficient}px ${
        123 / coefficient
      }px ${194 / coefficient}px `,
    },
  };

  const dimensionFull = {
    small: {
      width: 1080,
      height: 1920,
      fontSize: `${120}px`,
      margin: `${283}px ${267}px ${283}px ${113}px `,
    },
    medium: {
      width: 1080,
      height: 1080,
      fontSize: `${120}px`,
      margin: `${396}px ${147}px ${396}px ${67}px `,
    },
    large: {
      width: 1920,
      height: 1080,
      fontSize: `${220}px`,
      margin: `${123}px ${589}px ${123}px ${194}px `,
    },
  };
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-api-key", "PX9SAzAlbk8GgtWJPloa5aWMSJYdpqWx4bboNRum");

  const clips = [];

  for (
    let index = 0;
    index <
    (format === "gif" ? names.length : names.length * Number(repeatNumber));
    index++
  ) {
    clips.push(
      ...[
        {
          asset: {
            type: "html",
            html:
              "<div><p> <br> " +
              names[index % names.length] +
              "<br>  </p></div>",
            css:
              "div { text-align: left; font-family: 'HelveticaNeueLt Pro 55 Roman'; font-style: normal; font-weight: 700; font-size:" +
              `${
                format === "gif"
                  ? dimension[variant].fontSize
                  : dimensionFull[variant].fontSize
              }` +
              "; line-height: 80; color: #ffffff;  width: 967px; } p text-align: left;   width: 100%; } ",
          },
          start: index * Number(period),
          length: 0.95 * Number(period),
          offset: {
            x: 0.1,
          },
        },
      ]
    );
  }

  clips.push({
    asset: {
      type: "html",
      html: "<div><p>make <br> <br> matter </p></div>",
      css:
        "div { text-align: left; font-family: 'HelveticaNeueLt Pro 55 Roman'; font-style: normal; font-weight: 700; font-size:" +
        `${
          format === "gif"
            ? dimension[variant].fontSize
            : dimensionFull[variant].fontSize
        }` +
        "; line-height: 80; color: #ffffff;  width: 967px; } p text-align: left;   width: 100%; } ",
    },
    start: 0,
    length:
      format === "gif"
        ? Number(period) * names.length
        : Number(period) * names.length * Number(repeatNumber),
    offset: {
      x: 0.1,
    },
  });
  const raw = JSON.stringify({
    timeline: {
      cache: false,
      fonts: [
        {
          src: "https://vm-9dc5608b.na4u.ru/info/api/assets/HelveticaNeueCyr.ttf",
        },
      ],
      background: "#000000",
      tracks: [
        {
          clips: clips,
        },
      ],
    },
    output: {
      format: format,
      size: {
        width:
          format === "gif"
            ? dimension[variant].width
            : dimensionFull[variant].width,
        height:
          format === "gif"
            ? dimension[variant].height
            : dimensionFull[variant].height,
      },
      /*       ...(format === 'gif' && { repeat: true }), */
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const responseJson = await fetch(
    "https://api.shotstack.io/stage/render",
    requestOptions
  )
    .then((response) => {
      console.log("response", response);
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error(error);
    });

  const {
    response: { id },
  } = responseJson;

  return reqRep(id);
};
