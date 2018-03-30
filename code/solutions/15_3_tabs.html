<!doctype html>

<tab-panel>
  <div data-tabname="one">Tab one</div>
  <div data-tabname="two">Tab two</div>
  <div data-tabname="three">Tab three</div>
</tab-panel>
<script>
  function asTabs(node) {
    let tabs = Array.from(node.children).map(node => {
      let button = document.createElement("button");
      button.textContent = node.getAttribute("data-tabname");
      let tab = {node, button};
      button.addEventListener("click", () => selectTab(tab));
      return tab;
    });

    let tabList = document.createElement("div");
    for (let {button} of tabs) tabList.appendChild(button);
    node.insertBefore(tabList, node.firstChild);

    function selectTab(selectedTab) {
      for (let tab of tabs) {
        let selected = tab == selectedTab;
        tab.node.style.display = selected ? "" : "none";
        tab.button.style.color = selected ? "red" : "";
      }
    }
    selectTab(tabs[0]);
  }

  asTabs(document.querySelector("tab-panel"));
</script>
