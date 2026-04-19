/**Function to create a terminal console that shows the code needed to say hello world in this language */
function createTerminal(immediateParentElement, extension) {
    const parentElement = document.getElementById("main-content");
    const TERMINAL_CLASS = "terminal-overlay";
    var existing = document.querySelector("." + TERMINAL_CLASS);
    if (existing) {
      existing.remove();
    }

    var backdrop = document.createElement("div");
    const rect = immediateParentElement.getBoundingClientRect();
    backdrop.className = TERMINAL_CLASS;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "Computer");
    backdrop.style.position = "absolute";

    backdrop.style.transformOrigin = `${
        rect.left + rect.width + window.scrollX
      }px ${
        rect.top + rect.height + window.scrollY
      }px`;    backdrop.style.transform = "scale(0.2)";
    backdrop.style.opacity = "0";
    backdrop.style.top = `${rect.top + rect.height + window.scrollY}px`;
    backdrop.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;


    var panel = document.createElement("div");
    panel.className = "equality-terminal-panel";

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function onDrag(e) {
        if (!isDragging) return;
      
        backdrop.style.left = `${e.clientX - offsetX}px`;
        backdrop.style.top = `${e.clientY - offsetY}px`;
      }
    function stopDrag() {
        isDragging = false;
      }

    var titleBar = document.createElement("div");
    titleBar.className = "equality-terminal-titlebar";

    titleBar.addEventListener("mousedown", (e) => {
        isDragging = true;
      
        const rect = panel.getBoundingClientRect();
      
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
      
        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", stopDrag);
      });

    var dots = document.createElement("div");
    dots.className = "equality-terminal-dots";
    dots.innerHTML =
      '<span class="equality-terminal-dot equality-terminal-dot-red"></span>' +
      '<span class="equality-terminal-dot equality-terminal-dot-yellow"></span>' +
      '<span class="equality-terminal-dot equality-terminal-dot-green"></span>';

    var title = document.createElement("span");
    title.className = "equality-terminal-title";
    title.textContent = "hello-world." + extension;

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "equality-terminal-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "×";

    titleBar.appendChild(dots);
    titleBar.appendChild(title);
    titleBar.appendChild(closeBtn);

    var body = document.createElement("div");
    body.className = "equality-terminal-body";

    var logEl = document.createElement("div");
    logEl.className = "equality-terminal-log";

    body.appendChild(logEl);

    panel.appendChild(titleBar);
    panel.appendChild(body);
    backdrop.appendChild(panel);
    parentElement.appendChild(backdrop);
    requestAnimationFrame(() => {
        backdrop.style.transition = "transform 0.25s ease, opacity 0.25s ease";
        backdrop.style.transform = "scale(1)";
        backdrop.style.opacity = "1";
      });

    
    function close() {
        backdrop.remove();
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("mousedown", handleOutsideClick);
      }
  
      function onKey(e) {
        if (e.key === "Escape") close();
      }
  
      closeBtn.addEventListener("click", close);
      backdrop.addEventListener("click", function (e) {
        if (e.target === backdrop) close();
      });
      panel.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      function handleOutsideClick(e) {
        if (!backdrop.contains(e.target)) {
          close();
        }
      }
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", handleOutsideClick);
  
      return logEl;

}

function appendLine(container, text, className) {
    var line = document.createElement("div");
    line.className = "equality-terminal-line" + (className ? " " + className : "");
    line.textContent = text;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  }

function JavaScriptHelloWorld(element) {
    var logElJavaScript = createTerminal(element, "js");
    appendLine(logElJavaScript, "console.log('Hello World');", "equality-terminal-prompt");
}



function PythonHelloWorld(element) {
    var logElPython = createTerminal(element, "py");
    appendLine(logElPython, "print('Hello World')", "equality-terminal-prompt");
}


function JavaHelloWorld(element) {
    var logElJava = createTerminal(element, "java");
    appendLine(logElJava, "public class main {", "equality-terminal-prompt");
    appendLine(logElJava, "System.out.println('Hello World');", "equality-terminal-prompt");
    appendLine(logElJava, "}", "equality-terminal-prompt");
}

function CHelloWorld(element) {
    var logElC  = createTerminal(element, "c");
    appendLine(logElC, "#include <stdio.h>", "equality-terminal-prompt");
    appendLine(logElC, "int main() {", "equality-terminal-prompt");
    appendLine(logElC, "printf('Hello World\\n');", "equality-terminal-prompt");
    appendLine(logElC, "return 0;", "equality-terminal-prompt");
    appendLine(logElC, "}", "equality-terminal-prompt");
}

function RubyHelloWorld(element) {
    var logElRuby = createTerminal(element, "rb");
    appendLine(logElRuby, "puts 'Hello World'", "equality-terminal-prompt");
}

function AssemblyHelloWorld(element) {
    var logElAssembly = createTerminal(element, "asm");
    appendLine(logElAssembly, ".section .text", "equality-terminal-prompt");
    appendLine(logElAssembly, ".globl _start", "equality-terminal-prompt");
    appendLine(logElAssembly, "_start:", "equality-terminal-prompt");
    appendLine(logElAssembly, "   movl %ecx, $message", "equality-terminal-prompt");
    appendLine(logElAssembly, "   movl %edx, $len", "equality-terminal-prompt");
    appendLine(logElAssembly, "   movl %ebx, $1", "equality-terminal-prompt");
    appendLine(logElAssembly, "   movl %eax, $4", "equality-terminal-prompt");
    appendLine(logElAssembly, "   int $0x80", "equality-terminal-prompt");
    appendLine(logElAssembly, "   movl $1, %eax", "equality-terminal-prompt");
    appendLine(logElAssembly, "   int $0x80", "equality-terminal-prompt");
    appendLine(logElAssembly, ".section .data", "equality-terminal-prompt");
    appendLine(logElAssembly, "message: .ascii 'Hello World!\\n'", "equality-terminal-prompt");
    appendLine(logElAssembly, "len = . - message", "equality-terminal-prompt");


}   

function TypeScriptHelloWorld(element) {
    var logElTypeScript = createTerminal(element, "ts");
    appendLine(logElTypeScript, "const salutation: String = 'Hello World';", "equality-terminal-prompt");
    appendLine(logElTypeScript, "console.log(salutation);", "equality-terminal-prompt");
}
