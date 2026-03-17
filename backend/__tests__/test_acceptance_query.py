from src.datamodels import TIAReview, Severity
from src.query import get_insights

def test_passing_tia():
    # given a url exists to a passing TIA report
    passing_url = 'gs://tia-files/tia-uploads/dixie_outlet_mall.pdf'

    # when the AI receives the URL
    res = get_insights(passing_url)

    # then it doesn't fail it

    assert res.overall_rating != Severity.FAIL