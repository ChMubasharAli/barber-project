import { Loader, Table } from "@mantine/core";

const TableCom = ({ columns, data, isLoading, error }) => {
  return (
    <>
      <Table.ScrollContainer minWidth={1000}>
        <Table
          highlightOnHover
          striped
          className="w-full  font-normal text-[18px] "
        >
          {/* Table Head */}
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="text-left text-[18px] font-[400]  text-[#718EBF] p-4  specialBorderBottom pb-3 px-4"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data && data?.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className=" px-4 py-3 text-[#000000] text-[18px] font-[400]"
                    >
                      {row[col] || "—"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center  py-4 text-gray-500"
                >
                  {isLoading ? (
                    <Loader className="mx-auto" color="blue" type="bars" />
                  ) : error ? (
                    error
                  ) : (
                    "No Data Available"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  );
};

export default TableCom;
