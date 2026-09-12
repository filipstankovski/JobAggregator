package mk.ukim.finki.nvd.jobaggregator.web.dto;

import java.util.List;

public record JobFilterOptions(
        List<String> locations,
        List<String> categories,
        List<String> sources
) {
}
