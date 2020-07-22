import "./styles.css";

function clearProblem() {
  $(".problem-section").remove();
  $(".attribution").remove();
}

function clearAll() {
  $(".options-input-container").remove();
  $(".problem-section").remove();
  $(".attribution").remove();
}

async function addProblem(problem) {
  $(".options-input-container").after(
    `<div class="problem-section">
      <h2 class="section-header" id="article-header">Problem Text</h2>
      <!-- Replace with name of problem-->
      <div class="article-text" id="problem-text"></div>
    </div>
    <div class="problem-section">
      <h2 class="section-header" id="solutions-header">Solutions</h2>
      <!-- Make collapsible -->
      <div class="article-text" id="solution-text"></div>
    </div>
    <p class="attribution">
      Article content retrieved from the
      <a
        href="https://artofproblemsolving.com/wiki/index.php/"
        text="Art of Problem Solving Wiki"
        >Art of Problem Solving Wiki</a
      >.
    </p>`
  );
  var apiEndpoint = "https://artofproblemsolving.com/wiki/api.php";
  var pagename = problem;
  var params = `action=parse&page=${pagename}&format=json`;

  const response = await fetch(`${apiEndpoint}?${params}&origin=*`);
  const json = await response.json();

  if (typeof json.parse !== "undefined") {
    var problemText = json.parse.text["*"];
    $(".article-text").html(problemText); // need to sanitize quotes & angles
  } else {
    $(".article-text").html(
      `<p class="error">The page you specified does not exist.</p>`
    );
  }

  $("#article-header").html(pagename);
}

async function getPagesOfSubjectTags() {
  let inputSubjects = document.querySelector("#input-subjects");
  let tags = JSON.parse(inputSubjects.value);
  var pages = [];

  // (async function fetchAllCatsMembers() {
  //   const request = async () => {
  if (tags.some(e => e.value === "(All Subjects)")) {
    console.log("All Subjects");
  } else {
    //  for (let i = 0; i < tags.length; i++) {
    let i = 0;
    var apiEndpoint = "https://artofproblemsolving.com/wiki/api.php";
    var pagename = tags[i].value;
    var params = `action=query&list=categorymembers&cmtitle=Category:${pagename}&cmlimit=max&format=json`;
    var paramsContinue;
    var response = await fetch(`${apiEndpoint}?${params}&origin=*`);
    var json = await response.json();

    for (var j = 0; j < json.query.categorymembers.length; j++) {
      pages.push(json.query.categorymembers[j].title);
    }
    console.log(json.continue);
    while (typeof json.continue !== "undefined") {
      paramsContinue = params + `&cmcontinue=${json.continue.cmcontinue}`;
      console.log(paramsContinue);
      response = await fetch(`${apiEndpoint}?${paramsContinue}&origin=*`);
      json = await response.json();
      console.log(json);
      for (var j = 0; j < json.query.categorymembers.length; j++) {
        pages.push(json.query.categorymembers[j].title);
      }
    }
    console.log(pages.length);
    return pages;
  }
  // }
  //    };
  //  })();
}

$("#single-problem").click(function() {
  clearAll();

  $(".button-container").after(
    `<div class="options-input-container">
      <div class="options-input" id="single-input">
        <label class="input-label" for="title">
          Exact article name (title case):
        </label>
        <input class="input-field" type="text"/>
        <button class="input-button" id="single-button">
          View Article
        </button>
      </div>
      <div class="options-input" id="random-input">
        <label class="input-label" id="random-label">
          Choose the allowed subjects, tests, years, problem numbers: <!--replace with difficulty level?-->
        </label>
        <input id="input-subjects" name="input-subjects"
          class="input-multi"
          placeholder="Subjects, e.g. Olympiad Algebra Problems"
          value="(All Subjects)"
          data-whitelist="(All Subjects),
          Intermediate Algebra Problems,
          Intermediate Combinatorics Problems,
          Intermediate Geometry Problems,
          Intermediate Number Theory Problems,
          Intermediate Trigonometry Problems,
          Olympiad Algebra Problems,
          Olympiad Combinatorics Problems,
          Olympiad Geometry Problems,
          Olympiad Number Theory Problems,
          Olympiad Trigonometry Problems‏‎">
        </input>
        <input id="input-tests" name="input-tests"
          class="input-multi"
          placeholder="Tests, e.g. AMC 10"
          value="(All Tests)"
          data-whitelist="(All Tests), AJHSME, AHSME, AMC 8, AMC 10, AMC 12,
          USAJMO, USAMO, Canadian MO, IMO">
        </input>
        <div class="range-container">
          <input class="input-range" id="input-years"></input>
        </div>
        <div class="range-container">
          <input class="input-range" id="input-problems"></input>
        </div>
        <button class="input-button" id="random-button">
          View Random
        </button>
      </div>
      *The AHSME was gradually reduced from 50 to 30 problems from 1950 to 1974. Difficulty levels will likely be inaccurate for earlier years.
      <br/>
      **The 30-problem AHSME was replaced by the 25-problem AMC 10/12 with the 
      2000 exam.
    </div>`
  );

  var inputSubjects = document.querySelector("#input-subjects");
  new Tagify(inputSubjects);
  var inputTests = document.querySelector("#input-tests");
  new Tagify(inputTests);

  $("#input-years").ionRangeSlider({
    type: "double",
    grid: true,
    min: 1950,
    max: 2020,
    from: 1974,
    to: 2018,
    prettify_enabled: false
  });
  $("#input-problems").ionRangeSlider({
    type: "double",
    grid: true,
    min: 1,
    max: 50,
    from: 15,
    to: 20,
    prefix: "Problem "
  });
});

$("#printable-batch").click(function() {
  clearAll();

  $(".button-container").after(
    `<div class="options-input options-input-container" id="batch-input">
      (placeholder)
    </div>`
  );
});

$("#find-article").click(function() {
  clearAll();

  $(".button-container").after(
    `<div class="options-input options-input-container" id="find-input">
      <label class="input-label" for="title">
        Exact article name (title case):
      </label>
      <input class="input-field" type="text"/>
      <button class="input-button" id="find-button">
        View Article
      </button>
    </div>`
  );
});

$(".page-container").on("click", "#find-button", async function() {
  clearProblem();

  $(".options-input-container").after(
    `<div class="problem-section">
      <h2 class="section-header" id="article-header">Article Text</h2>
      <div class="article-text" id="full-text"></div>
    </div>
    <p class="attribution">
      Article content retrieved from the
      <a
        href="https://artofproblemsolving.com/wiki/index.php/"
        text="Art of Problem Solving Wiki"
        >Art of Problem Solving Wiki</a
      >.
    </p>`
  );

  var apiEndpoint = "https://artofproblemsolving.com/wiki/api.php";
  var pagename = $("#find-input .input-field").val();
  var params = `action=parse&page=${pagename}&format=json`;

  const response = await fetch(`${apiEndpoint}?${params}&origin=*`);
  const json = await response.json();

  if (typeof json.parse !== "undefined") {
    var problemText = json.parse.text["*"];
    $(".article-text").html(problemText); // need to sanitize quotes & angles
  } else {
    $(".article-text").html(
      `<p class="error">The page you specified does not exist.</p>`
    );
  }

  $("#article-header").html(pagename);
});
/* Make some kind of thing for clicking on links in the article */

$(".page-container").on("click", "#single-button", function() {
  clearProblem();

  addProblem($("#single-input .input-field").val());
});

$(".page-container").on("click", "#random-button", async function() {
  clearProblem();

  let pages = [];
  pages = await getPagesOfSubjectTags();
  let randomPage = pages[Math.floor(Math.random() * pages.length)];

  addProblem(randomPage);
});
