/*

Source of Calculations:

	Almanac for Computers, 1990
	published by Nautical Almanac Office
	United States Naval Observatory
	Washington, DC 20392
  
Ref:

  https://babel.hathitrust.org/cgi/pt?id=uiug.30112105115718&view=1up&seq=25&skin=2021
  https://www.edwilliams.org/sunrise_sunset_example.htm

Inputs:

	day, month, year:      date of sunrise/sunset
	latitude, longitude:   location for sunrise/sunset
	zenith:                Sun's zenith for sunrise/sunset
	  offical      = 90 degrees 50'
	  civil        = 96 degrees
	  nautical     = 102 degrees
	  astronomical = 108 degrees
	
	NOTE: longitude is positive for East and negative for West
        NOTE: the algorithm assumes the use of a calculator with the
        trig functions in "degree" (rather than "radian") mode. Most
        programming languages assume radian arguments, requiring back
        and forth convertions. The factor is 180/pi. So, for instance,
        the equation RA = atan(0.91764 * tan(L)) would be coded as RA
        = (180/pi)*atan(0.91764 * tan((pi/180)*L)) to give a degree
        answer with a degree input for L.

*/

export function sunRiseSet( year, month, day, localOffset, latitude, longitude, zenith, sunrise ) {

  function cos( xDeg ) {
    return Math.cos( xDeg * Math.PI / 180 );
  }
  
  function sin( xDeg ) {
    return Math.sin( xDeg * Math.PI / 180 );
  }
  
  function tan( xDeg ) {
    return Math.tan( xDeg * Math.PI / 180 );
  }
  
  function acos( x ) {
    return Math.acos( x ) * 180 / Math.PI;
  }
  
  function asin( x ) {
    return Math.asin( x ) * 180 / Math.PI;
  }
  
  function atan( x ) {
    return Math.atan( x ) * 180 / Math.PI;
  }
  
  function normalize( x, lo, hi ) {
    return lo + x % ( hi - lo ) + ( 0 <= x ? 0 : ( hi - lo ) );
  }

  // 1. first calculate the day of the year

	let N1 = Math.floor( 275 * month / 9 );
	let N2 = Math.floor( ( month + 9 ) / 12 );
	let N3 = ( 1 + Math.floor( ( year - 4 * Math.floor( year / 4 ) + 2 ) / 3 ) );
	let N = N1 - ( N2 * N3 ) + day - 30;
  

  // 2. convert the longitude to hour value and calculate an approximate time

	let lngHour = longitude / 15;
	
  let t = N + ( ( ( sunrise ? 6 : 18 ) - lngHour) / 24);

  // 3. calculate the Sun's mean anomaly
	
	let M = ( 0.9856 * t ) - 3.289;

  // 4. calculate the Sun's true longitude
	//NOTE: L potentially needs to be adjusted into the range [0,360) by adding/subtracting 360
  
	let L = normalize( M + ( 1.916 * sin( M ) ) + ( 0.020 * sin( 2 * M ) ) + 282.634, 0, 360 );

  // 5a. calculate the Sun's right ascension
	//NOTE: RA potentially needs to be adjusted into the range [0,360) by adding/subtracting 360
  
	let RA = normalize( atan( 0.91764 * tan( L ) ), 0, 360 );

  // 5b. right ascension value needs to be in the same quadrant as L

	let Lquadrant  = ( Math.floor( L / 90 ) ) * 90;
	let RAquadrant = ( Math.floor( RA / 90 ) ) * 90;
	RA = RA + ( Lquadrant - RAquadrant );

  // 5c. right ascension value needs to be converted into hours

	RA = RA / 15;

  // 6. calculate the Sun's declination

	let sinDec = 0.39782 * sin( L );
	let cosDec = cos( asin( sinDec ) );

  // 7a. calculate the Sun's local hour angle
	
	let cosH = ( cos( zenith ) - ( sinDec * sin( latitude ) ) ) / ( cosDec * cos( latitude ) );
	
	if ( sunrise && cosH > 1 ) {
    // the sun never rises on this location (on the specified date)
	  return NaN;
  }
  
	if ( !sunrise && cosH < -1 ) {
	  // the sun never sets on this location (on the specified date)
    return NaN;
  }

  // 7b. finish calculating H and convert into hours
	
  let H = sunrise ? 360 - acos( cosH ) : acos( cosH );
	
	H = H / 15;

  // 8. calculate local mean time of rising/setting
	
	let T = H + RA - ( 0.06571 * t ) - 6.622

  // 9. adjust back to UTC
	// NOTE: UT potentially needs to be adjusted into the range [0,24) by adding/subtracting 24
  
	let UT = normalize( T - lngHour, 0, 24 );
	
  // 10. convert UT value to local time zone of latitude/longitude
	
	let localT = UT + localOffset;
  return localT;
}

// export { sunRiseSet };
