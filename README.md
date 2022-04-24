# Sunrise-Sunset

## Source of Calculations:

	Almanac for Computers, 1990
	published by Nautical Almanac Office
	United States Naval Observatory
	Washington, DC 20392
  
## Ref:

- https://babel.hathitrust.org/cgi/pt?id=uiug.30112105115718&view=1up&seq=25&skin=2021
- https://www.edwilliams.org/sunrise_sunset_example.htm

## Inputs:

- **year, month, day**: Proleptic Gregorian calendar date of Sunrise / Sunset.
- **latitude, longitude**: Location of Sunrise / Sunset
- **zenith**: Sun's zenith for Sunrise / Sunset
	- offical      = 90 degrees 50'
	- civil        = 96 degrees
	- nautical     = 102 degrees
	- astronomical = 108 degrees
- **sunrise**: *true* if seeking Sunrise, *false* if seeking Sunset.
	
