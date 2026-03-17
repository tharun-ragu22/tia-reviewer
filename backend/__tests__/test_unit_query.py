from src.datamodels import TIAReview, Severity, Finding, MethodologyFlags
from unittest.mock import MagicMock, patch
from src.query import get_insights


def test_passing_tia():
    # given a url exists to a passing TIA report
    passing_url = "gs://tia-files/tia-uploads/dixie_outlet_mall.pdf"

    mock_review = TIAReview(
        summary="The TIA is well structured.",
        overall_rating=Severity.PASS,
        findings=[
            Finding(
                section="Trip Generation",
                severity=Severity.PASS,
                issue="ITE codes cited correctly",
                detail="Table 3-2 on page 14 references ITE code 820",
                recommendation="No action required",
            )
        ],
        methodology_flags=MethodologyFlags(
            ite_codes_cited=True,
            peak_hours_defined=True,
            study_area_justified=True,
            los_methodology_stated=True,
            mitigation_proportional=True,
        ),
    )

    with patch("src.query.genai.Client") as mock_client:
        # Wire up the chain: client.models.generate_content().text
        mock_instance = MagicMock()
        mock_client.return_value = mock_instance
        mock_instance.models.generate_content.return_value.parsed = mock_review

        result = get_insights("gs://tia-files/tia-uploads/test.pdf")

        assert result.overall_rating is Severity.PASS
        # assert result.methodology_flags.ite_codes_cited is True
        # assert len(result.findings) == 1
