import { Box, Button } from "@cloudscape-design/components";

export const CardsNoMatchState = props => (
    <Box textAlign="center" color="inherit">
        <b>No matches</b>
            <Box
            padding={{ bottom: "s" }}
            variant="p"
            color="inherit"
            >
            We can't find a match.
            </Box>
        <Button onClick={props.onClearFilter}>Clear filter</Button>
    </Box>
  );
  
  export const CardsEmptyState = () => (
    <Box textAlign="center" color="inherit">
        <b>No resources</b>
            <Box
            padding={{ bottom: "s" }}
            variant="p"
            color="inherit"
            >
            No resources to display.
            </Box>
        <Button>Create resource</Button>
    </Box>
  );