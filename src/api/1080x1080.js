function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("x-api-key", "sOP6UCkvBw5VXAJrljLFz94Zndc1rQlz7faDa6I3");

const requestResultOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

const requestResult = async (id) => {
  const {
    response: { url }
  } = await fetch(
    `https://api.shotstack.io/stage/render/${id}`,
    requestResultOptions
  ).then((response) => response.json());
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
  format = "gif"
) => {
  const dimension = {
    small: {
      width: 1080,
      height: 1920,
      fontSize: "130px",
      margin: "283px 267px 283px 113px"
    },
    medium: {
      width: 1080,
      height: 1080,
      fontSize: "130px",
      margin: "396px 147px 396px 67px"
    },
    large: {
      width: 1920,
      height: 1080,
      fontSize: "240px",
      margin: "123px 589px 123px 194px"
    }
  };
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-api-key", "sOP6UCkvBw5VXAJrljLFz94Zndc1rQlz7faDa6I3");

  const clips = [];

  for (let index = 0; index < names.length * 2; index++) {
    clips.push({
      asset: {
        type: "html",
        html:
          "<div><p>make <br> " +
          names[index % names.length] +
          "<br> matter </p></div>",
        css:
          "div { text-align: left; font-family: 'Roboto'; font-style: normal; font-weight: 700; font-size:" +
          dimension[variant].fontSize +
          "; line-height: 80; color: #ffffff;  width: 967px; } p text-align: left;   width: 100%; } "
      },
      start: index,
      length: 1,
      offset: {
        x: 0.1
      }
    });
  }

  const raw = JSON.stringify({
    timeline: {
      fonts: [
        {
          src: "https://templates.shotstack.io/basic/asset/font/roboto-bold.ttf"
        }
      ],
      background: "#000000",
      tracks: [
        {
          clips: clips
        }
      ]
    },
    output: {
      format: format,
      size: {
        width: dimension[variant].width,
        height: dimension[variant].height
      },
      ...(format === "gif" && { repeat: true })
    }
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const responseJson = await fetch(
    "https://api.shotstack.io/stage/render",
    requestOptions
  ).then((response) => response.json());

  const {
    response: { id }
  } = responseJson;

  return reqRep(id);
};
