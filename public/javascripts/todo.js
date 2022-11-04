$(document).ready(function () {
	var get_list = function () {
		$.ajax({
			type: "get",
			url: "/list",
			async: false,
			success: function (list) {
				console.log(list);
				if (list != null) {
					var trs = '';
					for (var i = 0, len = list.length; i < len; i++) {
						var elem = JSON.parse(list[i]);
						trs += '<tr>' +
							'<td>' + (i + 1) + '</td>' +
							'<td>' + elem.contents;

						if (elem.complete)
							trs += ' (완료)</td>';
						else
							trs += '</td>';
						trs += '<td><button type="button" class="btn btn-success">완료</button></td>' +
							'<td><button type="button" class="btn btn-danger">삭제</button></td>' +
							'</tr>';
					}
					$('tbody').html(trs);
				}
			}
		});
	}

	get_list();

	$(".form-inline button").click(function (e) {
		$.ajax({
			type: "POST",
			url: "/add",
			data: {
				'contents': $('#new_todo').val()
			},
			success: get_list
		});
	});

	$('tbody').on('click', '.btn-success', function (e) {
		const completedToDoElem = $(this);
		console.log(completedToDoElem);
		$.ajax({
			type: "POST",
			url: "/complete",
			data: {
				'index': parseInt($(this).parent().siblings(':first').text()) - 1
			},
			success: function () {
				// completedToDoElem.parents('tr').addClass('bg-secondary bg-gradient opacity-25');
				get_list();
			}
		});
	});

	$('tbody').on('click', '.btn-danger', function () {
		console.log($(this));
		$.ajax({
			type: "POST",
			url: "/del",
			data: {
				'index': parseInt($(this).parent().siblings(':first').text()) - 1
			},
			success: get_list
		});
	});
});