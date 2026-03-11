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
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
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
    warning: { main: '#ffcc00' },
    info: { main: '#c0c0c0' },
    error: { main: '#cd7f32' },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '48px',
      fontWeight: 600,
      letterSpacing: '-0.003em',
      lineHeight: 1.08349,
      '@media (max-width:768px)': { fontSize: '32px' },
    },
    h2: {
      fontSize: '32px',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      '@media (max-width:768px)': { fontSize: '24px' },
    },
    subtitle1: {
      fontSize: '21px',
      lineHeight: 1.381,
      fontWeight: 400,
      letterSpacing: '-0.011em',
    },
  },
  spacing: 8,
});

interface Driver {
  DriverName: string;
  CarNum?: string;
  ResultCarNum?: string;
  Points: number;
  originalPosition?: number;
  Driver?: Array<{
    DriverCity?: string;
    DriverState?: string;
  }>;
}

interface ClassPoints {
  class_name: string;
  points_data: Driver[];
  points_as_of?: string;
}

const classNameMappings: { [key: string]: string } = {
  'USRA B-Mods': 'Hacienda Carpet & Tile USRA B-Mods',
  'USRA Modifieds': 'Mendoza Law Firm USRA Modifieds',
  'USRA Stock Cars': 'Extreme Landscaping USRA Stock Cars',
  '360 Sprints - Winged': 'Desert Series 360 Wing Sprint Car',
  '360 Sprints - Non-Winged': 'Sunset Grill POWRi 360 Non-Winged Sprint Cars',
  '305 Sprints - Winged': 'White Sands Federal Credit Union POWRi 305 Winged',
  'Hobby Stocks': 'S.H. Automotive Pure Stocks',
  'Pro Legends': 'Hulsey Racing Legends',
  'Dirt Late Models': 'Anthony Sosa Roofing Late Models',
  'Super Truck': 'Johnstone Supply Super Trucks',
  'B Modifieds': 'X-Mods'
};

export default function PointsPage() {
  const [pointsData, setPointsData] = useState<ClassPoints[]>([]);
  const [filteredData, setFilteredData] = useState<ClassPoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const availableYears = React.useMemo(() => {
    const years = new Set<string>();
    pointsData.forEach(cls => {
      if (cls.points_as_of) {
        years.add(cls.points_as_of.substring(0, 4));
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [pointsData]);

  const pointsForSelectedYear = React.useMemo(() => {
    return pointsData.filter(cls =>
      cls.points_as_of && cls.points_as_of.startsWith(selectedYear)
    );
  }, [pointsData, selectedYear]);

  const toggleClassExpansion = (className: string) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(className)) {
      newExpanded.delete(className);
    } else {
      newExpanded.add(className);
    }
    setExpandedClasses(newExpanded);
  };

  useEffect(() => {
    loadPoints();
    const interval = setInterval(loadPoints, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-select most recent year when data loads
  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  useEffect(() => {
    filterData();
  }, [pointsForSelectedYear, selectedClass, searchTerm]);

  useEffect(() => {
    checkScrollButtons();
  }, [pointsData]);

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

  const loadPoints = async () => {
    try {
      const response = await fetch('/api/data?type=points');
      if (!response.ok) throw new Error('Failed to load points');
      const rawData = await response.json();

      if (Array.isArray(rawData)) {
        const formattedData = rawData.map((item: any) => ({
          class_name: classNameMappings[item.class_name] || item.class_name || 'Unknown Class',
          points_data: Array.isArray(item.points_data) ? item.points_data : [],
          points_as_of: item.points_as_of
        }));

        formattedData.sort((a: any, b: any) => {
          if (!a.points_as_of) return 1;
          if (!b.points_as_of) return -1;
          return new Date(b.points_as_of).getTime() - new Date(a.points_as_of).getTime();
        });

        setPointsData(formattedData);
      } else {
        setPointsData([]);
      }
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load points');
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = pointsForSelectedYear;

    filtered = filtered.map(cls => ({
      ...cls,
      points_data: cls.points_data.map((driver, originalIndex) => ({
        ...driver,
        originalPosition: originalIndex + 1
      }))
    }));

    if (selectedClass !== 'all') {
      filtered = filtered.filter(cls => cls.class_name === selectedClass);
    }

    if (searchTerm) {
      filtered = filtered.map(cls => ({
        ...cls,
        points_data: cls.points_data.filter(driver => {
          const name = (driver.DriverName || '').toLowerCase();
          const carNum = (driver.CarNum || driver.ResultCarNum || '').toString().toLowerCase();
          return name.includes(searchTerm.toLowerCase()) ||
                 carNum.includes(searchTerm.toLowerCase());
        })
      })).filter(cls => cls.points_data.length > 0);
    }

    setFilteredData(filtered);
  };

  const getHometown = (driver: Driver) => {
    if (driver.Driver && driver.Driver[0]) {
      const city = driver.Driver[0].DriverCity || '';
      const state = driver.Driver[0].DriverState || '';
      return `${city}${city && state ? ', ' : ''}${state}`.trim() || '-';
    }
    return '-';
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 6 }}>
        {/* Hero */}
        <Box sx={{
          textAlign: 'center',
          py: { xs: 4, md: 6 },
          px: 2,
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)'
        }}>
          <Typography variant="h1" gutterBottom sx={{ color: '#1d1d1f', fontWeight: 700, letterSpacing: '-0.02em', mb: 2 }}>
            {selectedYear} Points Standings
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868b', fontSize: '21px', fontWeight: 400, maxWidth: 600, mx: 'auto', mb: 1 }}>
            Track championship points across all racing classes
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ bgcolor: 'background.paper', py: 2, borderBottom: '1px solid #d2d2d7', position: 'sticky', top: '64px', zIndex: 100 }}>
          <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2 }, width: { xs: '100%', sm: '100%', md: '80%' }, mx: 'auto' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {availableYears.map(year => (
                  <Chip
                    key={year}
                    label={year}
                    onClick={() => { setSelectedYear(year); setSelectedClass('all'); }}
                    sx={{
                      backgroundColor: selectedYear === year ? '#000' : '#f1f1f1',
                      color: selectedYear === year ? '#fff' : '#000',
                      fontWeight: 600,
                      border: 'none',
                      '&:hover': { backgroundColor: selectedYear === year ? '#000' : '#e0e0e0' },
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                {canScrollLeft && (
                  <IconButton onClick={() => handleScroll('left')} sx={{ position: 'absolute', left: 0, zIndex: 1, backgroundColor: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }, width: 36, height: 36 }}>
                    <ChevronLeftIcon />
                  </IconButton>
                )}
                <Box
                  ref={scrollContainerRef}
                  onScroll={checkScrollButtons}
                  sx={{ display: 'flex', gap: 1, overflowX: 'auto', scrollBehavior: 'smooth', px: canScrollLeft || canScrollRight ? 5 : 1, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', maskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)' }}
                >
                  <Chip label="All Classes" onClick={() => setSelectedClass('all')} sx={{ flexShrink: 0, backgroundColor: selectedClass === 'all' ? '#000' : '#f1f1f1', color: selectedClass === 'all' ? '#fff' : '#000', fontWeight: 500, border: 'none', '&:hover': { backgroundColor: selectedClass === 'all' ? '#000' : '#e0e0e0' }, transition: 'all 0.3s ease' }} />
                  {pointsForSelectedYear.map(cls => (
                    <Chip key={cls.class_name} label={cls.class_name} onClick={() => setSelectedClass(cls.class_name)} sx={{ flexShrink: 0, backgroundColor: selectedClass === cls.class_name ? '#000' : '#f1f1f1', color: selectedClass === cls.class_name ? '#fff' : '#000', fontWeight: 500, border: 'none', '&:hover': { backgroundColor: selectedClass === cls.class_name ? '#000' : '#e0e0e0' }, transition: 'all 0.3s ease' }} />
                  ))}
                </Box>
                {canScrollRight && (
                  <IconButton onClick={() => handleScroll('right')} sx={{ position: 'absolute', right: 0, zIndex: 1, backgroundColor: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }, width: 36, height: 36 }}>
                    <ChevronRightIcon />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ px: { xs: 0, sm: 1 } }}>
                <TextField
                  size="small"
                  placeholder="Search driver or car number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
        <Container maxWidth={false} sx={{ width: { xs: '100%', sm: '100%', md: '80%' }, mx: 'auto', px: { xs: 1, sm: 2 }, py: 2 }}>
          {filteredData.length === 0 ? (
            <Alert severity="info">No results found matching your filters.</Alert>
          ) : (
            filteredData.map((classData) => (
              <Box key={classData.class_name} sx={{ mb: 6 }}>
                <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #d2d2d7' }}>
                  <Typography variant="h2" sx={{ color: '#000000', fontWeight: 700 }}>
                    {classData.class_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>
                    {classData.points_data.length} drivers competing
                    {classData.points_as_of && (
                      <Typography component="span" sx={{ ml: 2, fontStyle: 'italic', color: '#86868b' }}>
                        As of {new Date(classData.points_as_of + 'T00:00:00').toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', timeZone: 'America/Denver' })}
                      </Typography>
                    )}
                  </Typography>
                </Box>

                {isMobile ? (
                  <Stack spacing={2}>
                    {(() => {
                      const isExpanded = expandedClasses.has(classData.class_name);
                      const driversToShow = isExpanded ? classData.points_data : classData.points_data.slice(0, 10);
                      const hasMore = classData.points_data.length > 10;
                      return (
                        <>
                          {driversToShow.map((driver, index) => {
                            const position = driver.originalPosition || (index + 1);
                            const carNum = driver.CarNum || driver.ResultCarNum || '-';
                            return (
                              <Card key={`${driver.DriverName}-${carNum}-${index}`} elevation={0}>
                                <CardContent sx={{ position: 'relative', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #d2d2d7' }}>
                                  <Box sx={{ position: 'absolute', top: 16, right: 16, fontSize: '32px', fontWeight: 700, color: theme.palette.text.primary, opacity: 0.8 }}>
                                    {position}
                                  </Box>
                                  <Chip label={`#${carNum}`} size="small" sx={{ mb: 1, fontWeight: 700 }} />
                                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{driver.DriverName || 'Unknown'}</Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{getHometown(driver)}</Typography>
                                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                    <Typography component="span" variant="body1" color="text.secondary">Points:</Typography>
                                    {driver.Points || 0}
                                  </Typography>
                                </CardContent>
                              </Card>
                            );
                          })}
                          {hasMore && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                              <Chip
                                label={isExpanded ? 'Show Less' : `See More Standings (${classData.points_data.length - 10} more)`}
                                onClick={() => toggleClassExpansion(classData.class_name)}
                                icon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                sx={{ backgroundColor: '#f5f5f7', color: '#000', fontWeight: 600, fontSize: '14px', py: 2, px: 1, '&:hover': { backgroundColor: '#e0e0e0' }, transition: 'all 0.3s ease' }}
                              />
                            </Box>
                          )}
                        </>
                      );
                    })()}
                  </Stack>
                ) : (
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #d2d2d7', borderRadius: '12px', overflow: 'hidden' }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: '#f5f5f7', borderBottom: '2px solid #d2d2d7' }}>
                        <TableRow>
                          {['Pos', 'Car #', 'Driver', 'Hometown', 'Points'].map((header, i) => (
                            <TableCell key={header} align={i === 0 || i === 4 ? (i === 0 ? 'center' : 'right') : undefined} sx={{ fontSize: '14px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(() => {
                          const isExpanded = expandedClasses.has(classData.class_name);
                          const driversToShow = isExpanded ? classData.points_data : classData.points_data.slice(0, 10);
                          const hasMore = classData.points_data.length > 10;
                          return (
                            <>
                              {driversToShow.map((driver, index) => {
                                const position = driver.originalPosition || (index + 1);
                                const carNum = driver.CarNum || driver.ResultCarNum || '-';
                                return (
                                  <TableRow key={`${driver.DriverName}-${carNum}-${index}`} hover>
                                    <TableCell align="center" sx={{ fontWeight: 700, fontSize: '18px', color: theme.palette.text.primary }}>{position}</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>#{carNum}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{driver.DriverName || 'Unknown'}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontSize: '14px' }}>{getHometown(driver)}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '18px' }}>{driver.Points || 0}</TableCell>
                                  </TableRow>
                                );
                              })}
                              {hasMore && (
                                <TableRow>
                                  <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                                    <Chip
                                      label={isExpanded ? 'Show Less' : `See More Standings (${classData.points_data.length - 10} more)`}
                                      onClick={() => toggleClassExpansion(classData.class_name)}
                                      icon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                      sx={{ backgroundColor: '#f5f5f7', color: '#000', fontWeight: 600, fontSize: '14px', py: 2.5, px: 2, '&:hover': { backgroundColor: '#e0e0e0', cursor: 'pointer' }, transition: 'all 0.3s ease' }}
                                    />
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          );
                        })()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            ))
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
