function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("x-api-key", "NOYkJsQW2U3pBmd7RiK9l3P2gvUy5NGmaSutw7ok");

const requestResultOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

const requestResult = async (id) => {
  const {
    response: { url },
  } = await fetch(
    `https://api.shotstack.io/v1/render/${id}`,
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
  return url;
};

async function reqRep(id) {
  await timeout(2000);
  const url = await requestResult(id);
  if (url) {
    return url;
  } else {
    return await reqRep(id);
  }
}

export const get1080x1080 = async (
  names,
  variant = "small",
  format = "gif",
  period,
  repeatNumber
) => {
  const dimension = {
    small: {
      width: 1080,
      height: 1920,
      fontSize: "120px",
      margin: "283px 267px 283px 113px",
    },
    medium: {
      width: 1080,
      height: 1080,
      fontSize: "120px",
      margin: "396px 147px 396px 67px",
    },
    large: {
      width: 1920,
      height: 1080,
      fontSize: "220px",
      margin: "123px 589px 123px 194px",
    },
  };
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-api-key", "NOYkJsQW2U3pBmd7RiK9l3P2gvUy5NGmaSutw7ok");

  const clips = [];

  for (
    let index = 0;
    index < names.length * (format === "gif" ? 1 : Number(repeatNumber));
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
              "div { text-align: left; font-family: 'HelveticaNeueCyr'; font-style: normal; font-weight: 700; font-size:" +
              dimension[variant].fontSize +
              "; line-height: 80; color: #ffffff;  width: 967px; } p text-align: left;   width: 100%; } ",
          },
          start: index * Number(period),
          length: 0.95 * Number(period),
          offset: {
            x: 0.1,
          },
        },
        {
          asset: {
            type: "html",
            html: "<div><p>make <br> <br> matter </p></div>",
            css:
              "div { text-align: left; font-family: 'HelveticaNeueCyr'; font-style: normal; font-weight: 700; font-size:" +
              dimension[variant].fontSize +
              "; line-height: 80; color: #ffffff;  width: 967px; } p text-align: left;   width: 100%; } ",
          },
          start: index * Number(period),
          length: Number(period),
          offset: {
            x: 0.1,
          },
        },
      ]
    );
  }

  const raw = JSON.stringify({
    timeline: {
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
        width: dimension[variant].width,
        height: dimension[variant].height,
      },
      ...(format === "gif" && { repeat: true }),
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const responseJson = await fetch(
    "https://api.shotstack.io/v1/render",
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw response.status;
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
