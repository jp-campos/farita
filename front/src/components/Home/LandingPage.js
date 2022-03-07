import React from "react";
import Carousel from "react-bootstrap/Carousel";
import {
  Grid,
  Typography,
  ThemeProvider,
  useMediaQuery
} from "@material-ui/core";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import firstSlide from "./assets/firstSlide.png";
import secondSlide from "./assets/secondSlide.png";
import thirdSlide from "./assets/thirdSlide.png";
import fourthSlide from "./assets/fourthSlide.png";
import Comida from "./assets/Comida.png";
import Farrear from "./assets/Farrear.png";
import Jugar from "./assets/Jugar.png";
import Musica from "./assets/Musica.png";
import Logo from "../../assets/Logo.png";
import { FormattedMessage } from "react-intl";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Inter", "Roboto", "Arial"].join(","),
    h1: {
      color: "#1D2C41",
    },
    h2: {
      color: "#1D2C41",
    },
    h3: {
      color: "#1D2C41",
    },
    h4: {
      color: "#1D2C41",
    },
    h5: {
      color: "#1D2C41",
    },
    h6: {
      color: "#1D2C41",
    },
  },
  palette: {
    primary: {
      main: "#1D2C41",
    },
    secondary: {
      main: "#02F7BF",
    },
    warning: {
      main: "#ffbf00",
    },
    error: {
      main: "#eb4034",
    },
    success: {
      main: "#76A30F",
    },
  },
});

function MainSlider(isMobile, isMobileOrIpad) {
  const slide1 = () => {
    return (
      <Carousel.Item>
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{
            backgroundImage: !isMobile ? `url(${firstSlide})` : "",
            backgroundSize: "cover",
            width: "100%",
            height: "90vh",
          }}
        >
          {isMobile && (
            <img alt={"logo"} src={Logo} style={{ width: "50%", height: "15%" }} />
          )}
        </Grid>
      </Carousel.Item>
    );
  };

  const slide2 = () => {
    return (
      <Carousel.Item>
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{
            backgroundImage: !isMobile ? `url(${secondSlide})` : "",
            backgroundSize: "cover",
            width: "100%",
            height: "90vh",
          }}
        >
          <Grid xs={12} sm={6} item container justify="center">
            {isMobile && <img alt="comida" src={Comida} style={{ width: "100%" }} />}
          </Grid>
          <Grid xs={12} sm={6} item container justify="center">
            <Typography variant="h2" component="h1" align="center">
            <FormattedMessage id="Home.LandingPage.first" />
            </Typography>
          </Grid>
        </Grid>
      </Carousel.Item>
    );
  };

  const slide3 = () => {
    return (
      <Carousel.Item>
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{
            backgroundImage: !isMobile ? `url(${thirdSlide})` : "",
            backgroundSize: "cover",
            width: "100%",
            height: "90vh",
          }}
        >
          <Grid item container xs={12} sm={6} justify="center">
            {isMobile ? (
              <img alt="farrear" src={Farrear} style={{ width: "100%" }} />
            ) : (
              <Typography variant="h2" component="h3" align="center">
                <FormattedMessage id="Home.LandingPage.second" />
              </Typography>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            container
            justify="center"
            alignItems="center"
          >
            {isMobile && (
              <Typography variant="h2" component="h3" align="center">
                <FormattedMessage id="Home.LandingPage.second" />
              </Typography>
            )}
          </Grid>
        </Grid>
      </Carousel.Item>
    );
  };

  const slide4 = () => {
    return (
      <Carousel.Item>
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{
            backgroundImage: !isMobile ? `url(${fourthSlide})` : "",
            backgroundSize: "cover",
            width: "100%",
            height: "90vh",
          }}
        >
          <Grid
            container
            alignItems="center"
            justify="center"
            spacing={isMobile ? 1 : 6}
          >
            <Grid item xs={12} sm={6}>
              {isMobile && <img alt="jugar" src={Jugar} style={{ width: "100%" }} />}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h2" component="h3" align="center">
                <FormattedMessage id="Home.LandingPage.third" />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Carousel.Item>
    );
  };

  const slide5 = () => {
    return (
      <Carousel.Item>
      <Grid
      container
      alignItems="center"
      justify="center"
      style={{
        backgroundImage: !isMobile ? `url(${thirdSlide})` : "",
        backgroundSize: "cover",
        width: "100%",
        height: "90vh",
      }}
    >
      <Grid item container xs={12} sm={6} justify="center">
        {isMobile ? (
          <img alt="musica" src={Musica} style={{ width: "100%" }} />
        ) : (
          <Typography variant="h2" component="h3" align="center">
            <FormattedMessage id="Home.LandingPage.fourth" />
          </Typography>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        container
        justify="center"
        alignItems="center"
      >
        {isMobile && (
          <Typography variant="h2" component="h3" align="center">
            <FormattedMessage id="Home.LandingPage.fourth" />
          </Typography>
        )}
      </Grid>
    </Grid>
      </Carousel.Item>
    );
  };

  return (
    <div>
      <Carousel interval={null}>
        {slide1()}
        {slide2()}
        {slide3()}
        {slide4()}
        {slide5()}
      </Carousel>
    </div>
  );
}

function LandingPage(props) {
  const isMobileOrIpad = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <ThemeProvider theme={responsiveFontSizes(theme)}>
      <div
        style={{
          overflow: "hidden",
          backgroundColor: "#b0b9a8",
          height: "100%",
        }}
      >
        {MainSlider(isMobile, isMobileOrIpad)}
      </div>
    </ThemeProvider>
  );
}

export default LandingPage;
