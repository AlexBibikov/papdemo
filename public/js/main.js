$(document).ready(function () {
    $('#pool-state').on('change', function () { 
        var x = this.value;
        $('#pool-state-label').text(x);
        $.post("/api/usage", { usage: x });
    });
});
/*
$('a[name="about"]').click(function () { 
});

$('a[name="contact"]').click(function () { 
});

*/
