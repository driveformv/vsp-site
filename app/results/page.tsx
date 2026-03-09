'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  useMediaQuery,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#000000' },
    secondary: { main: '#86868b' },
    background: { default: '#f5f5f7', paper: '#ffffff' },
    text: { primary: '#1d1d1f', secondary: '#86868b' },
    warning: { main: '#ff9500' },
    success: { main: '#34c759' },
    error: { main: '#ff3b30' },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.003em',
      '@media (min-width:600px)': { fontSize: '3rem' },
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      '@media (min-width:600px)': { fontSize: '2rem' },
    },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
  },
  spacing: 8,
});

interface Result {
  DriverName: string;
  ResultCarNum: string;
  ResultPlace: string;
  ResultStart: string;
  ResultDNF?: boolean;
  ResultDNS?: boolean;
  ResultDQ?: boolean;
  Driver?: Array<{
    DriverFName?: string;
    DriverLName?: string;
    DriverCity?: string;
    DriverState?: string;
  }>;
}

interface Race {
  RaceName: string;
  RaceLaps: number;
  Results: Result[];
}

interface ClassData {
  ClassName: string;
  Races: Race[];
}

interface Event {
  id: number;
  event_name: string;
  event_date: string;
  results_data: {
    Classes: ClassData[];
  };
}

export default function ResultsPage() {
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const availableYears = React.useMemo(() => {
    const years = new Set<string>();
    eventsData.forEach(event => {
      if (event.event_date) {
        years.add(event.event_date.substring(0, 4));
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [eventsData]);

  const eventsForSelectedYear = React.useMemo(() => {
    return eventsData.filter(event =>
      event.event_date && event.event_date.startsWith(selectedYear)
    );
  }, [eventsData, selectedYear]);

  useEffect(() => {
    loadResults();
    const interval = setInterval(loadResults, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkScrollButtons();
  }, [eventsData]);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const loadResults = async () => {
    try {
      const response = await fetch('/api/data?type=results');
      if (!response.ok) throw new Error('Failed to load results');
      const data = await response.json();

      let processedData: Event[] = [];

      if (Array.isArray(data)) {
        processedData = data.map((item: any) => ({
          id: item.id || Math.random(),
          event_name: item.event_name || 'Unknown Event',
          event_date: item.event_date || new Date().toISOString(),
          results_data: item.results_data || { Classes: item.classes || [] }
        }));
      }

      const eventsWithResults = processedData.filter((event: Event) =>
        event.results_data &&
        event.results_data.Classes &&
        event.results_data.Classes.some((cls: ClassData) =>
          cls.Races && cls.Races.some((race: Race) =>
            race.Results && race.Results.length > 0
          )
        )
      );

      setEventsData(eventsWithResults.length > 0 ? eventsWithResults : processedData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results');
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    let filtered = selectedEvent === 'all' ? eventsForSelectedYear : eventsForSelectedYear.filter(event => event.id.toString() === selectedEvent);

    if (searchTerm) {
      filtered = filtered.map(event => ({
        ...event,
        results_data: {
          ...event.results_data,
          Classes: event.results_data.Classes.map(classData => ({
            ...classData,
            Races: classData.Races.map(race => ({
              ...race,
              Results: race.Results
                .filter(result => {
                  const driverName = getDriverName(result).toLowerCase();
                  const carNum = (result.ResultCarNum || '').toLowerCase();
                  return driverName.includes(searchTerm.toLowerCase()) ||
                         carNum.includes(searchTerm.toLowerCase());
                })
                .sort((a, b) => {
                  const posA = parseInt(a.ResultPlace) || 999;
                  const posB = parseInt(b.ResultPlace) || 999;
                  return posA - posB;
                })
            })).filter(race => race.Results.length > 0)
          })).filter(classData => classData.Races.length > 0)
        }
      })).filter(event => event.results_data.Classes.length > 0);
    } else {
      filtered = filtered.map(event => ({
        ...event,
        results_data: {
          ...event.results_data,
          Classes: event.results_data.Classes.map(classData => ({
            ...classData,
            Races: classData.Races.map(race => ({
              ...race,
              Results: race.Results.sort((a, b) => {
                const posA = parseInt(a.ResultPlace) || 999;
                const posB = parseInt(b.ResultPlace) || 999;
                return posA - posB;
              })
            }))
          }))
        }
      }));
    }

    return filtered;
  };

  const getDriverName = (result: Result) => {
    if (result.Driver && result.Driver[0]) {
      const fname = result.Driver[0].DriverFName || '';
      const lname = result.Driver[0].DriverLName || '';
      return `${fname} ${lname}`.trim() || result.DriverName || 'Unknown';
    }
    return result.DriverName || 'Unknown';
  };

  const getHometown = (result: Result) => {
    if (result.Driver && result.Driver[0]) {
      const city = result.Driver[0].DriverCity || '';
      const state = result.Driver[0].DriverState || '';
      return `${city}${city && state ? ', ' : ''}${state}`.trim() || '-';
    }
    return '-';
  };

  const getPositionChange = (result: Result) => {
    const position = parseInt(result.ResultPlace);
    const start = parseInt(result.ResultStart);
    if (isNaN(position) || isNaN(start)) return '-';
    if (result.ResultDNF || result.ResultDNS || result.ResultDQ) return '-';
    const change = start - position;
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return '-';
  };

  const getFinishDisplay = (result: Result) => {
    let display = result.ResultPlace || '-';
    if (result.ResultDNF) display += ' DNF';
    if (result.ResultDNS) display += ' DNS';
    if (result.ResultDQ) display += ' DQ';
    return display;
  };

  const getPositionChangeColor = (change: string) => {
    if (change.startsWith('+')) return theme.palette.success.main;
    if (change.startsWith('-') && change !== '-') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth={false} sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth={false} sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  const filteredEvents = getFilteredEvents();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 6 }}>
        {/* Hero */}
        <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 }, px: 2, background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)' }}>
          <Typography variant="h1" gutterBottom sx={{ color: '#1d1d1f', fontWeight: 700, letterSpacing: '-0.02em', mb: 2 }}>
            Race Results
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868b', fontSize: '21px', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            Complete results from all events and classes
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ bgcolor: 'background.paper', py: 2, borderBottom: '1px solid #d2d2d7', position: 'sticky', top: '64px', zIndex: 100 }}>
          <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2 }, width: { xs: '100%', sm: '100%', md: '80%' }, mx: 'auto' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {availableYears.map(year => (
                  <Chip key={year} label={year} onClick={() => { setSelectedYear(year); setSelectedEvent('all'); }}
                    sx={{ backgroundColor: selectedYear === year ? '#000' : '#f1f1f1', color: selectedYear === year ? '#fff' : '#000', fontWeight: 600, border: 'none', '&:hover': { backgroundColor: selectedYear === year ? '#000' : '#e0e0e0' }, transition: 'all 0.3s ease' }} />
                ))}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                {canScrollLeft && (
                  <IconButton onClick={() => handleScroll('left')} sx={{ position: 'absolute', left: 0, zIndex: 1, backgroundColor: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }, width: 36, height: 36 }}>
                    <ChevronLeftIcon />
                  </IconButton>
                )}
                <Box ref={scrollContainerRef} onScroll={checkScrollButtons}
                  sx={{ display: 'flex', gap: 1, overflowX: 'auto', scrollBehavior: 'smooth', px: canScrollLeft || canScrollRight ? 5 : 1, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', maskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)' }}>
                  <Chip label="All Events" onClick={() => setSelectedEvent('all')}
                    sx={{ flexShrink: 0, backgroundColor: selectedEvent === 'all' ? '#000' : '#f1f1f1', color: selectedEvent === 'all' ? '#fff' : '#000', fontWeight: 500, border: 'none', '&:hover': { backgroundColor: selectedEvent === 'all' ? '#000' : '#e0e0e0' }, transition: 'all 0.3s ease' }} />
                  {eventsForSelectedYear.map(event => (
                    <Chip key={event.id} label={`${event.event_name} - ${event.event_date}`} onClick={() => setSelectedEvent(event.id.toString())}
                      sx={{ flexShrink: 0, backgroundColor: selectedEvent === event.id.toString() ? '#000' : '#f1f1f1', color: selectedEvent === event.id.toString() ? '#fff' : '#000', fontWeight: 500, border: 'none', '&:hover': { backgroundColor: selectedEvent === event.id.toString() ? '#000' : '#e0e0e0' }, transition: 'all 0.3s ease' }} />
                  ))}
                </Box>
                {canScrollRight && (
                  <IconButton onClick={() => handleScroll('right')} sx={{ position: 'absolute', right: 0, zIndex: 1, backgroundColor: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }, width: 36, height: 36 }}>
                    <ChevronRightIcon />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ px: { xs: 0, sm: 1 } }}>
                <TextField size="small" placeholder="Search driver or car number" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: { xs: '100%', sm: 320 }, '& .MuiOutlinedInput-root': { borderRadius: '20px', backgroundColor: '#f1f1f1', '&:hover': { backgroundColor: '#e0e0e0' }, '&.Mui-focused': { backgroundColor: '#fff' } }, '& fieldset': { border: 'none' } }}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#606060' }} /></InputAdornment>,
                      endAdornment: searchTerm ? <InputAdornment position="end"><IconButton size="small" onClick={() => setSearchTerm('')}><ClearIcon sx={{ fontSize: '18px' }} /></IconButton></InputAdornment> : undefined,
                    }
                  }}
                />
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Content */}
        <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2 }, py: 2, width: { xs: '100%', sm: '100%', md: '80%' }, mx: 'auto' }}>
          {filteredEvents.length === 0 ? (
            <Alert severity="info">No race results available.</Alert>
          ) : (
            <Stack spacing={3}>
              {filteredEvents.map((event) => (
                <Card key={event.id} elevation={0} sx={{ border: '1px solid #d2d2d7', borderRadius: '12px', overflow: 'hidden' }}>
                  <CardContent>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }} gutterBottom>
                        {new Date(event.event_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                      <Typography variant="h2" sx={{ color: '#000000', fontWeight: 700 }}>
                        {event.event_name}
                      </Typography>
                    </Box>

                    {event.results_data.Classes.map((classData) =>
                      classData.Races && classData.Races.map((race) =>
                        race.Results && race.Results.length > 0 && (
                          <Accordion
                            key={`${classData.ClassName}-${race.RaceName}`}
                            defaultExpanded={!isMobile}
                            elevation={0}
                            sx={{ mb: 2, border: '1px solid #d2d2d7', borderRadius: '8px !important', '&:before': { display: 'none' } }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
                                <Box>
                                  <Typography variant="h3" sx={{ color: '#000000', fontWeight: 700 }}>{classData.ClassName}</Typography>
                                  <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>{race.RaceName}</Typography>
                                </Box>
                                <Chip label={`${race.RaceLaps} Laps`} size="small" color="primary" variant="outlined" />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              {isMobile ? (
                                <Stack spacing={2}>
                                  {race.Results.map((result, index) => (
                                    <Card key={`${result.DriverName}-${result.ResultCarNum}-${index}`} elevation={0} sx={{ border: '1px solid #d2d2d7', borderRadius: '8px' }}>
                                      <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="start">
                                          <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{getDriverName(result)}</Typography>
                                            <Typography variant="body2" color="text.secondary">#{result.ResultCarNum || '-'}</Typography>
                                            <Typography variant="body2" color="text.secondary">{getHometown(result)}</Typography>
                                          </Box>
                                          <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>{getFinishDisplay(result)}</Typography>
                                            <Typography variant="body2" color="text.secondary">Started: {result.ResultStart || '-'}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: getPositionChangeColor(getPositionChange(result)) }}>
                                              {getPositionChange(result)}
                                            </Typography>
                                          </Box>
                                        </Stack>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </Stack>
                              ) : (
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #d2d2d7', borderRadius: '8px', overflow: 'hidden' }}>
                                  <Table size="small">
                                    <TableHead sx={{ backgroundColor: '#f5f5f7', borderBottom: '2px solid #d2d2d7' }}>
                                      <TableRow>
                                        {['Finish', 'Start', '#', 'Driver', 'Hometown', '+/-'].map((header, i) => (
                                          <TableCell key={header} align={i === 5 ? 'center' : undefined} sx={{ fontSize: '14px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {header}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {race.Results.map((result, index) => (
                                        <TableRow key={`${result.DriverName}-${result.ResultCarNum}-${index}`} hover>
                                          <TableCell sx={{ fontWeight: 600 }}>{getFinishDisplay(result)}</TableCell>
                                          <TableCell>{result.ResultStart || '-'}</TableCell>
                                          <TableCell>{result.ResultCarNum || '-'}</TableCell>
                                          <TableCell sx={{ fontWeight: 500 }}>{getDriverName(result)}</TableCell>
                                          <TableCell sx={{ color: 'text.secondary' }}>{getHometown(result)}</TableCell>
                                          <TableCell align="center" sx={{ fontWeight: 600, color: getPositionChangeColor(getPositionChange(result)) }}>
                                            {getPositionChange(result)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        )
                      )
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
