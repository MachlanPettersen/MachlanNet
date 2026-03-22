import React from "react";
import styled, { keyframes } from "styled-components";
import { X } from "@phosphor-icons/react";
import { AstroSnapshot, formatCoord } from "./astronomy";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 5, 10, 0.85);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 100px 20px 40px;
  box-sizing: border-box;

  /* Fade mask so content fades out under the top nav */
  mask-image: linear-gradient(
    to bottom,
    transparent 0px,
    rgba(0, 0, 0, 0.3) 60px,
    black 100px
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0px,
    rgba(0, 0, 0, 0.3) 60px,
    black 100px
  );

  @media (max-width: 480px) {
    padding: 90px 12px 30px;
  }
`;

const Panel = styled.div`
  width: 100%;
  max-width: 720px;
  animation: ${slideUp} 0.4s ease-out;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 24px;
  background: rgba(10, 10, 18, 0.6);
  border: 1px solid rgba(213, 201, 190, 0.15);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d5c9be;
  cursor: pointer;
  z-index: 101;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e3955a;
    color: #e3955a;
  }

  @media (max-width: 480px) {
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
  }
`;

const SectionTitle = styled.h2`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #f5f2ea;
  margin: 0 0 8px 0;

  @media (max-width: 700px) {
    font-size: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const SectionSubtitle = styled.p`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 1.1rem;
  font-weight: 300;
  color: #8f8578;
  margin: 0 0 2rem 0;

  @media (max-width: 700px) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 0.82rem;
  }
`;

const Section = styled.section`
  margin-bottom: 2.5rem;

  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`;

const Label = styled.h3`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #e3955a;
  margin: 0 0 12px 0;
  letter-spacing: 0.3px;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
`;

const Paragraph = styled.p`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 0.9rem;
  line-height: 1.75;
  color: #d5c9be;
  margin: 0 0 12px 0;

  @media (max-width: 480px) {
    font-size: 0.82rem;
    line-height: 1.65;
  }
`;

const MathBlock = styled.div`
  background: rgba(245, 242, 234, 0.04);
  border-left: 3px solid #e3955a;
  border-radius: 0 8px 8px 0;
  padding: 14px 18px;
  margin: 12px 0 16px 0;
  font-family: "SF Mono", "Fira Code", "Cascadia Code", monospace;
  font-size: 0.82rem;
  line-height: 1.8;
  color: #f5f2ea;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 700px) {
    padding: 12px 14px;
    font-size: 0.75rem;
  }
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.68rem;
    line-height: 1.7;
    margin: 8px 0 12px 0;
  }
`;

const MathLine = styled.div`
  white-space: nowrap;
`;

const MathComment = styled.span`
  color: #8f8578;
  font-style: italic;

  @media (max-width: 700px) {
    display: none;
  }
`;

const MathResult = styled.span`
  color: #8a9f71;
  font-weight: 600;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(213, 201, 190, 0.08);
  margin: 2rem 0;

  @media (max-width: 480px) {
    margin: 1.5rem 0;
  }
`;

const Note = styled.p`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 0.78rem;
  line-height: 1.6;
  color: #8f8578;
  margin: 0;
  font-style: italic;

  @media (max-width: 480px) {
    font-size: 0.72rem;
  }
`;

const StyledLink = styled.a`
  color: #e3955a;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
    text-decoration: underline;
  }
`;

function fmt(n: number, decimals = 4): string {
  return n.toFixed(decimals);
}

function formatTimeUTC(date: Date): string {
  return date.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

interface MathExplanationProps {
  astro: AstroSnapshot;
  onClose: () => void;
}

const MathExplanation: React.FC<MathExplanationProps> = ({ astro, onClose }) => {
  const i = astro.intermediates;
  const sub = astro.subsolarPoint;

  return (
    <Backdrop onClick={(e) => e.target === e.currentTarget && onClose()}>
      <CloseButton onClick={onClose}>
        <X size={20} weight="bold" />
      </CloseButton>
      <Panel>
        <SectionTitle>How This Was Calculated</SectionTitle>
        <SectionSubtitle>
          All values computed client-side for {formatTimeUTC(astro.date)}
        </SectionSubtitle>

        <Section>
          <Label>1. Julian Date &amp; Epoch Offset</Label>
          <Paragraph>
            Astronomical calculations use the Julian Date (JD) — a continuous
            count of days since January 1, 4713 BC. We also compute <em>d</em>,
            the number of days since the J2000.0 epoch (January 1, 2000 at
            12:00 TT), which most modern solar position formulas are referenced
            to.
          </Paragraph>
          <MathBlock>
            <MathLine>
              JD = unix_ms / 86,400,000 + 2,440,587.5
            </MathLine>
            <MathLine>
              JD = {astro.date.getTime()} / 86400000 + 2440587.5 ={" "}
              <MathResult>{fmt(i.julianDate, 6)}</MathResult>
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              d = JD - 2,451,545.0 ={" "}
              <MathResult>{fmt(i.daysSinceJ2000, 4)} days</MathResult>
            </MathLine>
          </MathBlock>
        </Section>

        <Section>
          <Label>2. Solar Position</Label>
          <Paragraph>
            The sun's ecliptic longitude is computed from the mean longitude
            (<em>L</em>) and mean anomaly (<em>g</em>), which advance at
            known rates. The equation of center corrects for Earth's elliptical
            orbit — it's the difference between where the sun actually is
            versus where it would be on a perfectly circular orbit.
          </Paragraph>
          <MathBlock>
            <MathLine>
              L = 280.46° + 0.9856474° &times; d{" "}
              <MathComment>// mean longitude</MathComment>
            </MathLine>
            <MathLine>
              {"  "}= 280.46 + 0.9856474 &times; {fmt(i.daysSinceJ2000, 2)} ={" "}
              <MathResult>{fmt(i.meanLongitude, 4)}°</MathResult>{" "}
              <MathComment>(mod 360)</MathComment>
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              g = 357.528° + 0.9856003° &times; d{" "}
              <MathComment>// mean anomaly</MathComment>
            </MathLine>
            <MathLine>
              {"  "}= <MathResult>{fmt(i.meanAnomaly, 4)}°</MathResult>
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              &lambda; = L + 1.915° sin(g) + 0.020° sin(2g){" "}
              <MathComment>// ecliptic longitude</MathComment>
            </MathLine>
            <MathLine>
              {"  "}= {fmt(i.meanLongitude, 2)} + 1.915 &times; sin(
              {fmt(i.meanAnomaly, 2)}°) + 0.020 &times; sin(
              {fmt(i.meanAnomaly * 2, 2)}°)
            </MathLine>
            <MathLine>
              {"  "}= <MathResult>{fmt(i.eclipticLongitude, 4)}°</MathResult>
            </MathLine>
          </MathBlock>
        </Section>

        <Section>
          <Label>3. Solar Declination</Label>
          <Paragraph>
            The declination is the latitude where the sun appears directly
            overhead. It oscillates between ±23.44° over the year due to
            Earth's axial tilt (<em>&epsilon;</em>, the obliquity of the ecliptic).
            This is why we have seasons.
          </Paragraph>
          <MathBlock>
            <MathLine>
              &epsilon; = 23.439° - 0.0000004° &times; d ={" "}
              <MathResult>{fmt(i.obliquity, 4)}°</MathResult>{" "}
              <MathComment>// obliquity</MathComment>
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              &delta; = arcsin(sin(&epsilon;) &times; sin(&lambda;))
            </MathLine>
            <MathLine>
              {"  "}= arcsin(sin({fmt(i.obliquity, 2)}°) &times; sin(
              {fmt(i.eclipticLongitude, 2)}°))
            </MathLine>
            <MathLine>
              {"  "}={" "}
              <MathResult>
                {astro.solarDeclination >= 0 ? "+" : ""}
                {fmt(astro.solarDeclination, 4)}°
              </MathResult>
            </MathLine>
          </MathBlock>
          <Paragraph>
            Right now, the sun is directly overhead at{" "}
            <strong>
              {formatCoord(sub.lat, "N", "S")}
            </strong>
            {" "}latitude — that's{" "}
            {Math.abs(astro.solarDeclination) < 1
              ? "nearly on the equator"
              : astro.solarDeclination > 0
              ? "in the Northern Hemisphere (summer there)"
              : "in the Southern Hemisphere (summer there)"}
            .
          </Paragraph>
        </Section>

        <Section>
          <Label>4. Equation of Time &amp; Subsolar Point</Label>
          <Paragraph>
            The Equation of Time (EoT) is the discrepancy between a sundial and
            a clock. It arises from two effects: Earth's elliptical orbit (varying
            speed) and the obliquity of the ecliptic (the ecliptic plane is
            tilted relative to the equator). The EoT lets us compute the exact
            longitude where the sun is at its zenith.
          </Paragraph>
          <MathBlock>
            <MathLine>
              &alpha; = atan2(cos(&epsilon;) &times; sin(&lambda;), cos(&lambda;)){" "}
              <MathComment>// right ascension</MathComment>
            </MathLine>
            <MathLine>
              {"  "}= <MathResult>{fmt(i.rightAscension, 4)}°</MathResult>
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              EoT = (L - &alpha;) &times; 4 min/°{" "}
              <MathComment>// equation of time</MathComment>
            </MathLine>
            <MathLine>
              {"  "}={" "}
              <MathResult>
                {i.equationOfTimeMinutes >= 0 ? "+" : ""}
                {fmt(i.equationOfTimeMinutes, 2)} minutes
              </MathResult>
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              subsolar lon = -(UTC_h - 12) &times; 15° - EoT/4
            </MathLine>
            <MathLine>
              {"  "}= -({fmt(i.utcDecimalHours, 4)} - 12) &times; 15 -{" "}
              {fmt(i.equationOfTimeMinutes, 2)}/4
            </MathLine>
            <MathLine>
              {"  "}={" "}
              <MathResult>
                {fmt(sub.lon, 4)}° ({formatCoord(sub.lon, "E", "W")})
              </MathResult>
            </MathLine>
          </MathBlock>
          <Paragraph>
            Combined with the declination, the subsolar point is at{" "}
            <strong>
              {formatCoord(sub.lat, "N", "S")},{" "}
              {formatCoord(sub.lon, "E", "W")}
            </strong>
            {" "}— it's currently solar noon near{" "}
            <strong>{astro.middayRegion}</strong>.
          </Paragraph>
        </Section>

        <Divider />

        <Section>
          <Label>5. Lunar Phase</Label>
          <Paragraph>
            The moon's phase is calculated from the synodic period — the time
            between successive new moons (29.53059 days). We measure the elapsed
            time since a known new moon (January 6, 2000 at 18:14 UTC) and take
            the modulus to find where we are in the current cycle.
          </Paragraph>
          <MathBlock>
            <MathLine>
              T_synodic = 29.53059 days{" "}
              <MathComment>// mean synodic period</MathComment>
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              elapsed = (now - known_new_moon) mod T_synodic
            </MathLine>
            <MathLine>
              {"  "}={" "}
              <MathResult>{fmt(i.lunarElapsedDays, 4)} days</MathResult>{" "}
              into the current cycle
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              phase = elapsed / T_synodic ={" "}
              {fmt(i.lunarElapsedDays, 4)} / {fmt(i.lunarCycleDays, 5)}
            </MathLine>
            <MathLine>
              {"  "}={" "}
              <MathResult>
                {fmt(astro.moonPhaseFraction, 4)}
              </MathResult>
              {" "}
              <MathComment>
                // 0=new, 0.25=first qtr, 0.5=full
              </MathComment>
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              illum = (1 - cos(phase &times; 2&pi;)) / 2 &times; 100%
            </MathLine>
            <MathLine>
              {"  "}= (1 - cos({fmt(astro.moonPhaseFraction, 4)} &times; 2&pi;))
              / 2 &times; 100
            </MathLine>
            <MathLine>
              {"  "}={" "}
              <MathResult>{astro.moonIllumination}%</MathResult>
            </MathLine>
          </MathBlock>
          <Paragraph>
            That gives us a <strong>{astro.moonPhaseName.toLowerCase()}</strong>{" "}
            {astro.moonPhaseEmoji} at {astro.moonIllumination}% illumination.
            In the 3D scene, the moon is lit by a directional light from the
            sun's position so the illuminated crescent matches the real phase.
          </Paragraph>
        </Section>

        <Section>
          <Label>6. 3D Scene Mapping</Label>
          <Paragraph>
            The local apparent solar time determines the sun's angle in the
            orbital plane. The equation of time correction shifts the sun from
            its mean position to its true position. Solar declination adds a
            vertical offset representing Earth's axial tilt.
          </Paragraph>
          <MathBlock>
            <MathLine>
              solar_time = UTC + tz + EoT/60
            </MathLine>
            <MathLine>
              {"  "}= {fmt(i.utcDecimalHours, 4)} +{" "}
              {-astro.date.getTimezoneOffset() / 60} +{" "}
              {fmt(i.equationOfTimeMinutes, 2)}/60
            </MathLine>
            <MathLine>
              {"  "}={" "}
              <MathResult>{fmt(i.localSolarTime, 4)} hours</MathResult>
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              sun_angle = (solar_time - 6) / 24 &times; 2&pi;
            </MathLine>
            <MathLine>
              {"  "}= ({fmt(i.localSolarTime, 4)} - 6) / 24 &times; 2&pi;
            </MathLine>
            <MathLine>
              {"  "}={" "}
              <MathResult>{fmt(astro.sunAngle, 4)} rad</MathResult>
            </MathLine>
            <MathLine>&nbsp;</MathLine>
            <MathLine>
              moon_angle = sun_angle + phase &times; 2&pi;
            </MathLine>
            <MathLine>
              {"  "}= {fmt(astro.sunAngle, 4)} +{" "}
              {fmt(astro.moonPhaseFraction, 4)} &times; 2&pi;
            </MathLine>
            <MathLine>
              {"  "}={" "}
              <MathResult>{fmt(astro.moonAngle, 4)} rad</MathResult>
            </MathLine>
          </MathBlock>
          <Paragraph>
            The Earth rotates at one revolution per 24 hours (2&pi; / 86,400
            &asymp; 7.27 &times; 10&#8315;&sup5; rad/s). This is too slow to
            see in real-time, but it's astronomically correct.
          </Paragraph>
        </Section>

        <Divider />

        <Note>
          These calculations use simplified low-precision solar position
          formulas from Jean Meeus'{" "}
          <StyledLink
            href="https://www.willbell.com/math/mc1.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Astronomical Algorithms
          </StyledLink>
          {" "}— accurate to within ~1° for the sun and ~2 days for moon
          phase. No external APIs are used; everything runs in your browser.
          The continent shapes on the globe are procedurally generated using
          elliptical distance functions placed at real-world coordinates with
          noise-distorted edges.
        </Note>
      </Panel>
    </Backdrop>
  );
};

export default MathExplanation;
