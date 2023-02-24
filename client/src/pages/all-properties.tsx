import { Add } from "@mui/icons-material";
import { useTable } from "@pankod/refine-core";
import { Box, Stack, Typography, TextField, Select, MenuItem } from "@pankod/refine-mui";
import { useNavigate } from "@pankod/refine-react-router-v6";

import { PropertyCard, CustomButton } from "components";
import { useMemo } from "react";


const AllProperties = () => {
  const navigate = useNavigate();

  const { 
    tableQueryResult: { data, isLoading, isError },
    current,
    setCurrent,
    setPageSize,
    pageCount,
    sorter, setSorter,
    filters, setFilters,
  } = useTable();

  // to avoid errors an empty array is created in case of no data present
  const allProperties = data?.data ?? [];

  // sort by price 
  const currentPrice = sorter.find((item) => item.field === "price")?.order;
  const toggleSort = (field: string) => {
    setSorter([{ field, order: currentPrice === "asc" ? "desc" : "asc"}])
  }

  const currentFilterValues = useMemo(() => {
    const logicalFilters = filters.flatMap((item) => ("field" in item ? item : []))

    return {
      // filter by title
      title: logicalFilters.find((item) => item.field === "title")?.value || "",
      // filter by property type
      propertyType: logicalFilters.find((item) => item.field === "propertyType")?.value || "",
    }

  }, [filters])

  if(isLoading) return <Typography color="#11142d">loading...</Typography>
  if(isError) return <Typography color="#11142d">error</Typography>

  // override blank outlined border color and text color
  const overrideStyling = {
    fieldset: { borderColor: "rgba(0,0,0,0.23)" },
    "& .MuiInputBase-root": {
    color: "#919191",
    }
  }

  return (
    <Box>

      <Box 
        mt="20px"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3
       }}
      >
        <Stack 
          direction='column'
          width='100%' 
        >
                  <Typography 
          fontSize={25}
          fontWeight={700}
          color="#11142d"
        >
         {!allProperties.length ? "Sorry, there are no results for this type." : "All Properties"}
        </Typography>
        <Box
          mb={2}
          mt={3}
          display="flex"
          width="84%"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            mb={{xs: "20px", sm: 0}}
          >
            <CustomButton 
              title={`Sort price ${currentPrice === "asc" ? "↑" : "↓" }`}
              handleClick={() => toggleSort("price")}
              backgroundColor="#475be8"
              color="#fcfcfc"
            />
              <TextField 
                sx={overrideStyling}
                variant="outlined"
                color="info"
                placeholder="Search by title"
                value={currentFilterValues.title}
                onChange={(e) => {
                  setFilters([
                    {
                      field: "title",
                      operator: "contains",
                      value: e.currentTarget.value ? e.currentTarget.value : undefined
                    }
                  ])
                }}
              />
              <Select 
                sx={{
                fieldset: { borderColor: "rgba(0,0,0,0.23)" },
                "& .MuiInputBase-root": {
                color: "#919191",
                },
                '.MuiSelect-icon': {
                  color: "#919191"
                },
                }}
                style={{
                  borderColor: "rgba(0,0,0,0.23)",
                  color: "#919191"
                }}
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{
                  "aria-label": "Without label"
                }}
                defaultValue=""
                value={currentFilterValues.propertyType}
                onChange={(e) => {
                  setFilters([
                    {
                      field: "propertyType",
                      operator: "eq",
                      value: e.target.value
                    }
                  ], "replace")
                }}
              >
                <MenuItem value="">All</MenuItem>
                  {["Apartment", "Villa", "Farmhouse", "Condo", 
                  "Townhouse", "Duplex", "Studio", "Hotel"].map((type) => (
                  <MenuItem key={type} value={type.toLowerCase()}>{type}</MenuItem>)
                  )}
              </Select>
          </Box>
        </Box>
        </Stack>
      </Box>



      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems="center"
      >
        <CustomButton 
          title="Add Property"
          handleClick={() => navigate('/properties/create')}
          backgroundColor="#475be8"
          color="#fcfcfc"
          icon={ <Add />}
        />
      </Stack>

      <Box mt="20px"
        sx={{
          display: "flex",  
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {allProperties.map((property) => (
          <PropertyCard 
          key={property._id}
          id={property._id}
          title={property.title}
          price={property.price}
          location={property.location}
          photo={property.photo}
          />
        ))}
      </Box>

      {allProperties.length > 0 && (
        <Box 
          display="flex"
          gap={2}
          mt={3}
          flexWrap="wrap"
          >
            <CustomButton 
              title="Previous"
              handleClick={() => setCurrent((prev) => prev - 1)}
              backgroundColor="#475bef"
              color="#fcfcfc"
              disabled={!(current > 1)}
            />
            <Box 
              color="#919191"
              display={{ xs: "hidden", sm: "flex" }}
              alignItems="center"
              gap="5px"
            >
              Page{" "}<strong>{current} of {pageCount}</strong>
            </Box>
            <CustomButton 
              title="Next"
              handleClick={() => setCurrent((prev) => prev + 1)}
              backgroundColor="#475bef"
              color="#fcfcfc"
              disabled={current === pageCount}
            />
            <Select 
                sx={{
                fieldset: { borderColor: "rgba(0,0,0,0.23)" },
                "& .MuiInputBase-root": {
                color: "#919191",
                },
                '.MuiSelect-icon': {
                  color: "#919191"
                },
                }}
                style={{
                  borderColor: "rgba(0,0,0,0.23)",
                  color: "#919191"
                }}
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{
                  "aria-label": "Without label"
                }}
                defaultValue={10}
                onChange={(e) => setPageSize(e.target.value ? Number(e.target.value) : 10)}
              >
                {[10, 20 , 30, 40, 50].map((size) => (
                   <MenuItem key={size} value={size}>Show {size}</MenuItem>
                ))} 
              </Select>
        </Box>
      )}
    </Box>
  )
}

export default AllProperties